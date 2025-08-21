
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Phone, MapPin, Pencil, ShoppingBag, History, PackageCheck, Clock, Home } from 'lucide-react';
import type { Order } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, limit, orderBy } from 'firebase/firestore';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type OrderWithDate = Omit<Order, 'createdAt' | 'orderTime'> & {
    id: string;
    createdAt: Date;
    orderTime: Date;
}

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [recentOrders, setRecentOrders] = useState<OrderWithDate[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);
  
  useEffect(() => {
    const fetchRecentOrders = async () => {
        if (!user || !db) {
            setOrdersLoading(false);
            return;
        }
        setOrdersLoading(true);
        try {
            const ordersCollectionRef = collection(db, 'orders');
            const q = query(
                ordersCollectionRef,
                where('userId', '==', user.uid),
                orderBy('orderTime', 'desc'),
                limit(3)
            );
            const querySnapshot = await getDocs(q);
            const fetchedOrders: OrderWithDate[] = querySnapshot.docs.map(doc => {
                const data = doc.data() as Order;
                return {
                    ...data,
                    id: doc.id,
                    createdAt: (data.createdAt as any)?.toDate() || new Date(),
                    orderTime: (data.orderTime as Timestamp)?.toDate() || new Date(),
                }
            });
            setRecentOrders(fetchedOrders);
        } catch (error) {
            console.error("Error fetching recent orders:", error);
        } finally {
            setOrdersLoading(false);
        }
    };
    if (user) {
        fetchRecentOrders();
    }
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <Card className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="space-y-4 flex-1">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 flex-1">
        <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30 p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                  <AvatarImage src={profile.photoURL} alt={profile.fullName} />
                  <AvatarFallback><User className="h-16 w-16" /></AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold font-headline">{profile.fullName || "Valued Customer"}</h1>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <p className="mt-2 text-sm max-w-prose text-foreground/80">{profile.bio || "No bio provided."}</p>
                </div>
                <Button onClick={() => router.push('/profile/edit')} className="md:ml-auto" variant="outline">
                    <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                     <h2 className="font-headline text-xl font-semibold">Contact Information</h2>
                     <div className="flex items-center gap-3 rounded-lg p-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <span>{profile.email}</span>
                    </div>
                     <div className="flex items-center gap-3 rounded-lg p-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <span>{profile.phoneNumber || "Not provided"}</span>
                    </div>
                     <div className="flex items-center gap-3 rounded-lg p-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>{profile.address || "Not provided"}</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-headline text-xl font-semibold">Recent Orders</h2>
                        <Button variant="ghost" asChild>
                            <Link href="/orders">View All <History className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </div>
                    {ordersLoading ? (
                         <div className="space-y-2">
                             <Skeleton className="h-16 w-full" />
                             <Skeleton className="h-16 w-full" />
                         </div>
                    ) : recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {recentOrders.map(order => (
                                <Card key={order.id} className="p-4 flex items-center gap-4">
                                     <div className="bg-secondary rounded-md p-2">
                                        <Image src={order.productImage} alt={order.productName} width={48} height={48} className="rounded-sm" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold">{order.productName}</p>
                                        <p className="text-xs text-muted-foreground">{order.orderTime.toLocaleDateString()}</p>
                                    </div>
                                    <Badge variant={order.orderStatus === 'Delivered' ? 'default' : 'secondary'} className={order.orderStatus === 'Delivered' ? 'bg-green-600' : 'bg-amber-500'}>
                                        {order.orderStatus === 'Delivered' ? <PackageCheck className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                                        {order.orderStatus}
                                    </Badge>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="flex flex-col items-center justify-center p-8 border-2 border-dashed h-full text-center">
                             <ShoppingBag className="h-10 w-10 text-muted-foreground mb-2" />
                             <p className="text-muted-foreground text-sm">You haven't placed any orders yet.</p>
                             <Button variant="secondary" className="mt-4" asChild><Link href="/shop">Start Shopping</Link></Button>
                        </Card>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
