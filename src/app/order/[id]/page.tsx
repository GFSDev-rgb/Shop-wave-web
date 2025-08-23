
'use client';

import { Suspense } from 'react';
import OrderPlacement from './order-placement';
import { Loader2 } from 'lucide-react';

export default function OrderPage({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <OrderPlacement productId={params.id} />
        </Suspense>
    );
}
