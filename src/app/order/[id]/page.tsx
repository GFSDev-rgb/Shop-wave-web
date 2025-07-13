
'use client';

import { Suspense } from 'react';
import OrderPlacement from './order-placement';

export default function OrderPage({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderPlacement productId={params.id} />
        </Suspense>
    );
}
