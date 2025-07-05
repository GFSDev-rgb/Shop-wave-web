"use client";

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import RecommendedProducts from '@/components/ai/recommended-products';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const { products, loading: productsLoading } = useProducts();
  const { loading: authLoading } = useAuth();
  const featuredProducts = products.slice(0, 4);

  const isLoading = authLoading || productsLoading;

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="bg-transparent">
        <div className="container mx-auto grid md:grid-cols-2 items-center gap-8 px-4 py-12">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-300 via-purple-400 to-indigo-400">
              Experience the New Wave
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Discover curated collections and unique finds. ShopWave brings you the best in modern style and quality.
            </p>
            <Button asChild size="lg" className="mt-8 bg-primary/20 border border-primary/50 text-primary-foreground hover:bg-primary/40 transition-all duration-300 transform hover:-translate-y-1">
              <Link href="/shop">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="flex justify-center [perspective:1000px]">
            <Image
              src="https://scontent.fjsr13-1.fna.fbcdn.net/v/t39.30808-6/515905510_122134625648805080_4405844629990309115_n.jpg?stp=dst-jpg_p180x540_tt6&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=LAWGFzy8f40Q7kNvwEmaL1u&_nc_oc=Adnn9CkadTJnC2wcjkrDdNMCeyGVZc6JPcSZ-ra17LyKuPf3oDmyzFMs0ADFSQQWalc&_nc_zt=23&_nc_ht=scontent.fjsr13-1.fna&_nc_gid=g0-Hl-8BpGivOZ0QRzJ51Q&oh=00_AfNyQ7oy0XTN5GmGAvrllnvpeylPQtU18lUiWQJ_N6mbjQ&oe=686DFBAA"
              alt="A stylish man holding shopping bags"
              data-ai-hint="happy shopper"
              width={600}
              height={400}
              className="rounded-lg object-contain shadow-2xl transition-transform duration-700 ease-in-out hover:[transform:rotateY(10deg)_scale(1.05)]"
              priority
            />
          </div>
        </div>
      </section>


      <section className="container mx-auto px-4">
        <h2 className="font-headline text-4xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
             Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[400px] w-full rounded-lg bg-black/20" />
                </div>
            ))
          ) : featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <RecommendedProducts />

    </div>
  );
}
