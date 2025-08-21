
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import { ArrowRight, User } from 'lucide-react';
import { useProducts } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import RecommendedProducts from '@/components/ai/recommended-products';

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
              src="https://scontent.fjsr13-1.fna.fbcdn.net/v/t39.30808-6/514417589_122134632728805080_1173047015335082163_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CTLL4g4TTMEQ7kNvwHZrVXu&_nc_oc=AdmOXo7Q5x7H-RXcdoUhdSaE0xmoq-0E8z4ic2FomQzp43TwGUqmslLCjpUBN86V1rY&_nc_zt=23&_nc_ht=scontent.fjsr13-1.fna&_nc_gid=NbGz6uIhzU8JTJVV90E0Zg&oh=00_AfORFghBAWjanPcMzX5LcC7zXueEC92WAoFozbnhtJJwqA&oe=686DFAF5"
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

      {user && <RecommendedProducts />}

    </div>
  );
}
