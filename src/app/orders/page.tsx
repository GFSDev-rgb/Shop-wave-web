
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type OrderWithId = Omit<Order, 'id'> & {
    id: string;
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !db) {
        setLoading(false);
        return;
      }
      
      try {
        const ordersCollectionRef = collection(db, 'orders');
        const q = query(
          ordersCollectionRef, 
          where('userId', '==', user.uid),
          orderBy('orderTime', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const fetchedOrders: OrderWithId[] = querySnapshot.docs.map(doc => {
            const data = doc.data() as Omit<Order, 'id'>;
            return {
              ...data,
              id: doc.id,
            }
        });
        
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && !authLoading) {
      fetchOrders();
    } else if (!user && !authLoading) {
        router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-6 w-1/2 mt-4" />
        </header>
        <div className="space-y-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <header className="mb-12">
        <h1 className="font-headline text-5xl font-bold">My Orders</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Here is a list of your past purchases.
        </p>
      </header>
      
      {orders.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-6 text-2xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-muted-foreground">
            You haven't placed any orders with us yet.
          </p>
          <Button asChild className="mt-6">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
            {orders.map(order => (
                <Card key={order.id} className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center text-xl">
                            <span>Order #{order.id.substring(0, 8)}...</span>
                            <span className="text-base font-normal text-muted-foreground">
                                {(order.orderTime as unknown as Timestamp)?.toDate().toLocaleDateString() ?? 'N/A'}
                            </span>
                        </CardTitle>
                        <CardDescription>
                            Total: <span className="font-bold text-primary">Tk {order.total.toFixed(2)}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Separator className="mb-4" />
                        <div className="space-y-4">
                            {order.items.map(item => (
                                <div key={item.productId} className="flex items-center gap-4">
                                    <Image src={item.image} alt={item.name} data-ai-hint="product photo" width={64} height={64} className="rounded-md object-cover"/>
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.quantity} x Tk {item.price.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
