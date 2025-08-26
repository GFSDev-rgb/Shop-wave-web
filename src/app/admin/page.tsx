
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, Clock, Undo2, DollarSign, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type OrderWithId = Order & { id: string };

type HistoryEntry = {
    orderId: string;
    previousStatus: string;
    newStatus: string;
};

export default function AdminDashboard() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<OrderWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        if (!authLoading) {
            if (!user || !isAdmin) {
                router.push('/');
            }
        }
    }, [user, isAdmin, authLoading, router]);

    useEffect(() => {
        if (user && isAdmin) {
            const q = query(collection(db, 'orders'), orderBy('orderTime', 'desc'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const ordersData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Ensure orderTime is converted to a Date object safely
                    const orderTime = data.orderTime instanceof Timestamp ? data.orderTime.toDate() : new Date();
                    return {
                        id: doc.id,
                        ...(data as Omit<Order, 'id'>),
                        orderTime,
                    }
                }) as OrderWithId[];
                setOrders(ordersData);
                setLoading(false);
            }, (error) => {
                console.error("Error fetching orders:", error);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user, isAdmin]);

    const stats = useMemo(() => {
        const totalOrders = orders.length;
        const totalRevenue = orders
            .filter(order => order.orderStatus === 'Delivered')
            .reduce((sum, order) => sum + order.total, 0);
        const pendingOrders = orders.filter(order => order.orderStatus === 'Pending').length;
        const deliveredOrders = orders.filter(order => order.orderStatus === 'Delivered').length;

        return { totalOrders, totalRevenue, pendingOrders, deliveredOrders };
    }, [orders]);
    
    const updateOrderStatus = async (orderId: string, newStatus: 'Pending' | 'Delivered') => {
        const orderToUpdate = orders.find(o => o.id === orderId);
        if (!orderToUpdate) return;
        
        const previousStatus = orderToUpdate.orderStatus;
        if (previousStatus === newStatus) return;

        const orderDocRef = doc(db, 'orders', orderId);
        await updateDoc(orderDocRef, { orderStatus: newStatus });

        // Add to history for undo functionality
        const newHistoryEntry: HistoryEntry = { orderId, previousStatus, newStatus };
        setHistory(prev => [...prev, newHistoryEntry]);
    };
    
    const undoLastAction = async () => {
        if (history.length === 0) return;
        
        const lastAction = history[history.length - 1];
        const { orderId, previousStatus } = lastAction;

        const orderDocRef = doc(db, 'orders', orderId);
        await updateDoc(orderDocRef, { orderStatus: previousStatus });

        // Remove the action from history
        setHistory(prev => prev.slice(0, -1));
    };

    if (authLoading || loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    
    if (!isAdmin) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-12">
             <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Store Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Tk {stats.totalRevenue.toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground">From delivered orders</p>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                                <p className="text-xs text-muted-foreground">All-time orders received</p>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                                <p className="text-xs text-muted-foreground">Orders awaiting delivery</p>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
                                <p className="text-xs text-muted-foreground">Completed orders</p>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-3xl">Order Management</CardTitle>
                    </div>
                    <Button onClick={undoLastAction} disabled={history.length === 0} variant="outline">
                        <Undo2 className="mr-2 h-4 w-4" />
                        Undo Last Change
                    </Button>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" className="w-full space-y-4">
                        {orders.map(order => (
                            <AccordionItem key={order.id} value={order.id} className="border rounded-lg px-4 bg-background">
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-left">
                                            <p className="font-semibold">{order.items.length > 1 ? `${order.items[0].name} & more...` : order.items[0].name}</p>
                                            <p className="text-sm text-muted-foreground">{order.fullName}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-sm text-muted-foreground hidden md:block">
                                                {order.orderTime ? new Date(order.orderTime).toLocaleString() : 'N/A'}
                                            </p>
                                            <Badge variant={order.orderStatus === 'Delivered' ? 'default' : 'secondary'} className={order.orderStatus === 'Delivered' ? 'bg-green-600' : 'bg-amber-500'}>
                                                {order.orderStatus}
                                            </Badge>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4 border-t">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="md:col-span-1 space-y-4">
                                            <h4 className="font-semibold mb-2">Items</h4>
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex items-center gap-4">
                                                    <Image src={item.image} alt={item.name} width={60} height={75} className="rounded-md object-cover" />
                                                    <div>
                                                        <p className="font-semibold">{item.name}</p>
                                                        {item.size && <p className="text-sm">Size: {item.size}</p>}
                                                        <p className="text-sm">Qty: {item.quantity}</p>
                                                        <p className="text-sm font-bold">Tk {item.price.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="md:col-span-1">
                                            <h4 className="font-semibold mb-2">Customer Details</h4>
                                            <p>{order.fullName}</p>
                                            <p>{order.phoneNumber}</p>
                                            <p className="text-muted-foreground">{order.fullAddress}, {order.village}, {order.city}</p>
                                        </div>
                                        <div className="md:col-span-1 flex flex-col items-start justify-center gap-2">
                                            <h4 className="font-semibold">Update Status</h4>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'Pending')} disabled={order.orderStatus === 'Pending'}>
                                                    <Clock className="mr-2 h-4 w-4"/>
                                                    Mark as Pending
                                                </Button>
                                                <Button size="sm" onClick={() => updateOrderStatus(order.id, 'Delivered')} disabled={order.orderStatus === 'Delivered'}>
                                                    <CheckCircle className="mr-2 h-4 w-4"/>
                                                    Mark as Delivered
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
