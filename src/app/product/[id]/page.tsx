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

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
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
        <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-12 items-start">
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
