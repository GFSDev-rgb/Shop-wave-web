
'use client';

import { Suspense } from 'react';
import { notFound, useParams } from 'next/navigation';
import ProductView from './product-view';
import ProductPageSkeleton from './product-page-skeleton';
import { useProducts } from '@/hooks/use-products';

export default function ProductPage() {
  const params = useParams();
  const { products, loading } = useProducts();
  const id = params.id as string;

  if (loading) {
    return <ProductPageSkeleton />;
  }

  const product = products.find(p => p.id === id);

  if (!product) {
    // This can still be useful if the ID is genuinely invalid
    // after the products have loaded.
    notFound();
  }
  
  return (
    <Suspense fallback={<ProductPageSkeleton />}>
        <ProductView initialProduct={product} />
    </Suspense>
  );
}
