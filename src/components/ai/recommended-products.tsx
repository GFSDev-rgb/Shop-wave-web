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
    <section className="bg-transparent relative py-16 overflow-hidden">
      <Image
        src="https://scontent.fjsr13-1.fna.fbcdn.net/v/t39.30808-6/514349647_122134628744805080_5530986704383849379_n.jpg?stp=dst-jpg_p180x540_tt6&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=1VZz36hMxkEQ7kNvwFk9q8Y&_nc_oc=AdmNQD88QlNJbsdW1T1TmVufnkjY6N1__VQMnIKYkQSoN6VXV9a3pPDegNGD3M3c-Hw&_nc_zt=23&_nc_ht=scontent.fjsr13-1.fna&_nc_gid=X42o6_BkYhwN7G8el28l8A&oh=00_AfN3z4PnY3YZxB-6aBed0FNRW-8cgjd90Db9abN9CuyF3g&oe=686DF26E"
        alt="Fashion models"
        data-ai-hint="fashion models"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 opacity-10"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/80 z-0" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center gap-4 mb-12">
            <Wand2 className="h-8 w-8 text-primary" />
            <h2 className="font-headline text-4xl font-bold text-center">Just For You</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
      </div>
    </section>
  );
}
