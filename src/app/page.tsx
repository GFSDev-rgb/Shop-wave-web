import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { products } from '@/lib/data';
import ProductCard from '@/components/product-card';
import RecommendedProducts from '@/components/ai/recommended-products';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="bg-background">
        <div className="container mx-auto grid md:grid-cols-2 items-center gap-8 px-4 py-12">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold text-foreground">
              Experience the New Wave
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Discover curated collections and unique finds. ShopWave brings you the best in modern style and quality.
            </p>
            <Button asChild size="lg" className="mt-8 shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1">
              <Link href="/shop">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="flex justify-center [perspective:1000px]">
            <Image
              src="https://storage.googleapis.com/aifirebase-7996c.appspot.com/image_1720743588204_67531.png"
              alt="An illustration of a person shopping online from a large mobile phone screen"
              data-ai-hint="online shopping"
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
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <RecommendedProducts />

    </div>
  );
}
