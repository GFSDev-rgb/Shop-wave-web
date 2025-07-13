
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
    const { user, loading: authLoading } = useAuth();
    const { products, loading: productsLoading } = useProducts();
    const { toast } = useToast();

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [village, setVillage] = useState('');
    const [fullAddress, setFullAddress] = useState('');

    const quantity = parseInt(searchParams.get('quantity') || '1', 10);
    const product = products.find(p => p.id === productId);
    
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !product) return;

        if (!fullName || !phoneNumber || !city || !village || !fullAddress) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please fill out all required fields.',
            });
            return;
        }

        setIsPlacingOrder(true);

        try {
            await addDoc(collection(db, 'orders'), {
                userId: user.uid,
                productId: product.id,
                productName: product.name,
                productImage: product.image,
                price: product.price,
                quantity: quantity,
                deliveryMethod: 'Cash on Delivery',
                fullName,
                phoneNumber,
                city,
                village,
                fullAddress,
                orderTime: serverTimestamp(),
                orderStatus: 'Pending',
            });

            toast({
                title: 'Order Placed!',
                description: 'Thank you for your purchase. We will contact you soon.',
            });

            router.push('/');
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
                                    <p className="text-muted-foreground">Quantity: {quantity}</p>
                                    <p className="font-bold text-xl text-primary mt-2">Tk {(product.price * quantity).toFixed(2)}</p>
                                </div>
                            </div>
                             <div className="mt-6">
                                <h4 className="font-semibold mb-2">Delivery Method</h4>
                                <p className="text-muted-foreground">Cash on Delivery</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-3xl">Delivery Information</CardTitle>
                            <CardDescription>Please provide your delivery details.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handlePlaceOrder}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" value={city} onChange={e => setCity(e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="village">Village/Area</Label>
                                        <Input id="village" value={village} onChange={e => setVillage(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fullAddress">Full Delivery Address</Label>
                                    <Input id="fullAddress" value={fullAddress} onChange={e => setFullAddress(e.target.value)} required />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button size="lg" className="w-full" type="submit" disabled={isPlacingOrder}>
                                    {isPlacingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingBag className="mr-2 h-4 w-4" />}
                                    Place Order
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
