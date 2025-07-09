import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/data-access';
import ProductView from './product-view';
import { Suspense } from 'react';
import ProductPageSkeleton from './product-page-skeleton';

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

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  return (
    <Suspense fallback={<ProductPageSkeleton />}>
        <ProductView initialProduct={product} />
    </Suspense>
  );
}
