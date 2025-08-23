
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useProducts } from '@/hooks/use-products';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function OrderPlacement({ productId }: { productId: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, profile, loading: authLoading } = useAuth();
    const { products, loading: productsLoading } = useProducts();
    const { toast } = useToast();

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const quantity = parseInt(searchParams.get('quantity') || '1', 10);
    const size = searchParams.get('size') || 'One Size';
    const product = products.find(p => p.id === productId);
    
    useEffect(() => {
        if (!authLoading && !user) {
            router.push(`/login`);
        }
    }, [user, authLoading, router]);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !product || !profile) return;

        setIsPlacingOrder(true);
        const total = product.price * quantity;

        try {
            await addDoc(collection(db, 'orders'), {
                userId: user.uid,
                productName: product.name,
                productImage: product.image,
                quantity: quantity,
                price: product.price,
                size: size,
                total: total,
                orderTime: serverTimestamp(),
                orderStatus: 'Pending',
                fullName: profile.fullName,
                phoneNumber: profile.phoneNumber,
                city: profile.address.split(',').pop()?.trim() || '',
                village: profile.address.split(',').slice(0, -1).join(',').trim() || '',
                fullAddress: profile.address,
            });

            toast({
                title: 'Order Placed!',
                description: 'Thank you for your purchase. We will contact you soon.',
            });

            router.push('/orders');
        } catch (error) {
            console.error('Error placing order:', error);
            toast({
                variant: 'destructive',
                title: 'Order Failed',
                description: 'There was a problem placing your order. Please try again.',
            });
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (authLoading || productsLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    
    if (!product) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <p className="text-muted-foreground">The product you are trying to order does not exist.</p>
                <Button asChild className="mt-4"><Link href="/shop">Go to Shop</Link></Button>
            </div>
        )
    }

     if (!profile?.fullName || !profile.address) {
        return (
             <div className="container mx-auto px-4 py-12 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">Complete Your Profile</CardTitle>
                        <CardDescription>Please complete your profile with your full name and address before placing an order.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild><Link href="/profile/edit">Edit Profile</Link></Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }


    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-3xl">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <Image src={product.image} alt={product.name} width={100} height={120} className="rounded-lg object-cover" />
                                <div>
                                    <h3 className="font-semibold text-lg">{product.name}</h3>
                                     <p className="text-muted-foreground">Size: {size}</p>
                                    <p className="text-muted-foreground">Quantity: {quantity}</p>
                                    <p className="font-bold text-xl text-primary mt-2">Tk {(product.price * quantity).toFixed(2)}</p>

                                </div>
                            </div>
                             <div className="mt-6">
                                <h4 className="font-semibold mb-2">Delivery Address</h4>
                                <p className="text-muted-foreground">{profile.fullName}</p>
                                <p className="text-muted-foreground">{profile.fullAddress}</p>
                                <p className="text-muted-foreground">{profile.phoneNumber}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-3xl">Confirm Order</CardTitle>
                            <CardDescription>Your order will be shipped to the address in your profile. Review and place your order.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handlePlaceOrder}>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Payment will be handled as Cash on Delivery.</p>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button size="lg" className="w-full" type="submit" disabled={isPlacingOrder}>
                                    {isPlacingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingBag className="mr-2 h-4 w-4" />}
                                    Place Order
                                </Button>
                                <Button variant="link" asChild><Link href={`/product/${product.id}`}>Cancel</Link></Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
