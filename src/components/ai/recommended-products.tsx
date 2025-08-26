
"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Wand2 } from "lucide-react";
import { getRecommendationsAction } from "@/app/actions/get-recommendations";
import Image from "next/image";

export default function RecommendedProducts() {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      const recommendations = await getRecommendationsAction();
      setRecommendedProducts(recommendations.slice(0, 4)); // Limit to 4
      setLoading(false);
    };

    fetchRecommendations();
  }, []);

  return (
    <section className="container mx-auto px-4 pt-8 pb-8">
        <div className="flex items-center justify-center gap-4 mb-12">
            <Wand2 className="h-8 w-8 text-primary" />
            <h2 className="font-headline text-4xl font-bold text-center">Just For You</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[400px] w-full rounded-lg bg-black/20" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4 bg-black/20" />
                        <Skeleton className="h-4 w-1/2 bg-black/20" />
                    </div>
                </div>
            ))
          ) : recommendedProducts.length > 0 ? (
            recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              Could not load recommendations at this time.
            </p>
          )}
        </div>
    </section>
  );
}
