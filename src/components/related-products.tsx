
"use client";

import { useMemo } from 'react';
import { useProducts } from '@/hooks/use-products';
import ProductCard from '@/components/product-card';
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedProductsProps {
  currentProductId: string;
}

export default function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const { products, loading } = useProducts();

  const relatedProducts = useMemo(() => {
    if (loading || !products || products.length === 0) return [];
    
    // Filter out the current product, shuffle the rest, and take the top 4
    return products
      .filter(p => p.id !== currentProductId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }, [products, currentProductId, loading]);

  if (loading) {
    return (
      <section className="mt-16 md:mt-24">
        <h2 className="font-headline text-3xl font-bold text-center mb-12">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (relatedProducts.length === 0) {
    return null; // Don't render the section if there are no related products
  }

  return (
    <section className="mt-16 md:mt-24">
      <h2 className="font-headline text-3xl font-bold text-center mb-12">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {relatedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
