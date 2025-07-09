
"use client";

import { useMemo } from 'react';
import { useProducts } from '@/hooks/use-products';
import ProductCard from '@/components/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';

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
        <section className="mt-16 xl:mt-0">
            <h2 className="font-headline text-2xl xl:text-3xl font-bold mb-6 xl:mb-8 text-left xl:text-center">
                <Skeleton className="h-8 w-48 xl:mx-auto" />
            </h2>
            {/* Desktop Skeleton */}
            <div className="hidden xl:flex flex-col space-y-6">
                 {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-4 items-center">
                        <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
            {/* Mobile/Tablet Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 xl:hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-full flex-shrink-0">
                        <div className="flex flex-col space-y-3">
                            <Skeleton className="h-[400px] w-full rounded-lg" />
                        </div>
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
    <section className="mt-16 xl:mt-0">
      <h2 className="font-headline text-2xl xl:text-3xl font-bold mb-6 xl:mb-8 text-left xl:text-center">You Might Also Like</h2>
      
      {/* Desktop sidebar layout (xl and up) */}
      <div className="hidden xl:flex flex-col space-y-4">
        {relatedProducts.map(product => (
          <Link href={`/product/${product.id}`} key={product.id} className="flex items-center gap-4 group p-2 rounded-lg hover:bg-muted transition-colors">
            <Image 
                src={product.image} 
                alt={product.name}
                data-ai-hint="product photo"
                width={80} 
                height={80} 
                className="rounded-md object-cover w-20 h-20 flex-shrink-0"
            />
            <div className="flex-1">
              <p className="font-semibold leading-tight group-hover:underline">{product.name}</p>
              <p className="text-primary font-bold mt-1">${product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile/Tablet grid layout (below xl) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 xl:hidden">
        {relatedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
