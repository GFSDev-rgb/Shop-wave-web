'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, Loader2 } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import type { OrderItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CheckoutPage() {
  const { user, isFirebaseEnabled } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    if (!isFirebaseEnabled || !db || !user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to place an order.',
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Your cart is empty.',
      });
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderItems: OrderItem[] = cartItems.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
      }));

      // A top-level 'orders' collection is simple and effective.
      // Each order document will have a 'userId' field to isolate data.
      const ordersCollectionRef = collection(db, 'orders');

      await addDoc(ordersCollectionRef, {
        userId: user.uid,
        items: orderItems,
        total: cartTotal,
        createdAt: serverTimestamp(),
      });
      
      await clearCart();

      toast({
        title: 'Order Placed!',
        description: 'Thank you for your purchase.',
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

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
            <CreditCard className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="font-headline text-4xl">Checkout</CardTitle>
            <CardDescription className="text-lg">Review your order and complete your purchase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            {cartItems.map(item => (
                <div key={item.product.id} className="flex justify-between items-center text-sm py-1">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
            ))}
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          <Alert>
              <Lock className="h-4 w-4" />
              <AlertTitle>This is a demo</AlertTitle>
              <AlertDescription>
                No payment will be processed. Clicking "Place Order" will create an order in your account and clear your cart.
              </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
            <Button size="lg" className="w-full" onClick={handlePlaceOrder} disabled={isPlacingOrder || cartItems.length === 0}>
                {isPlacingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Place Order'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
