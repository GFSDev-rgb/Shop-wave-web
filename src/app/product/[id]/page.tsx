import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/data-access';
import ProductView from './product-view';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function getProduct(id: string) {
  const product = await getProductById(id);
  if (!product) {
    notFound();
  }
  return product;
}

export async function generateMetadata({ params }: { params: { id:string } }): Promise<Metadata> {
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: product.name,
    description: product.description.substring(0, 150),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 150),
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
  }
}

function ProductPageSkeleton() {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)] gap-8 md:gap-12">
                {/* Main Content Skeleton */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
                    <Skeleton className="w-full aspect-[4/5] rounded-lg" />
                    <div className="space-y-6">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-10 w-1/3" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
                {/* Related Products Skeleton */}
                <div className="mt-16 md:mt-0">
                    <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-left md:text-center">
                        <Skeleton className="h-8 w-48 md:mx-auto" />
                    </h2>
                    {/* Desktop Skeleton */}
                    <div className="hidden md:flex flex-col space-y-6">
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
                    {/* Mobile Skeleton */}
                    <div className="md:hidden flex overflow-x-auto space-x-6 -mx-4 px-4 pb-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="w-72 flex-shrink-0">
                                <div className="flex flex-col space-y-3">
                                    <Skeleton className="h-[400px] w-full rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  return (
    <Suspense fallback={<ProductPageSkeleton />}>
        <ProductView initialProduct={product} />
    </Suspense>
  );
}
