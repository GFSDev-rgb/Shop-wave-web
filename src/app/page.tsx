
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import { ArrowRight, Wand2 } from 'lucide-react';
import { useProducts } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import dynamic from 'next/dynamic';

const RecommendedProducts = dynamic(() => import('@/components/ai/recommended-products'), {
    loading: () => (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-[400px] w-full rounded-lg bg-black/20" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4 bg-black/20" />
                            <Skeleton className="h-4 w-1/2 bg-black/20" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ),
    ssr: false
});

export default function Home() {
  const { products, loading: productsLoading } = useProducts();
  const { user, loading: authLoading } = useAuth();
  const featuredProducts = products.slice(0, 4);

  const isLoading = authLoading || productsLoading;

  return (
    <div className="flex flex-col gap-16 md:gap-24 flex-1">
      {/* Hero Section */}
      <section className="bg-transparent">
        <div className="container mx-auto grid md:grid-cols-2 items-center gap-12 px-4 py-16 md:py-24">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground">
              Experience the New Wave
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Discover curated collections and unique finds. ShopWave brings you the best in modern style and quality.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/shop">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="flex justify-center">
            <Image
              src="/assets/home.jpg"
              alt="A stylish arrangement of fashion products"
              data-ai-hint="fashion layout"
              width={600}
              height={400}
              className="rounded-lg object-cover shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="font-headline text-4xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
             Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                </div>
            ))
          ) : (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      <div className="py-8" />
      
      {user && <RecommendedProducts />}

    </div>
  );
}
