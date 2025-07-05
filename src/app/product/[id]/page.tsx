"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import ProductDetailsClient from "./product-details-client";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useProducts } from "@/hooks/use-products";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { getProductById, loading: productsLoading } = useProducts();
  const [product, setProduct] = useState<Product | undefined | null>(undefined);

  useEffect(() => {
    if (!productsLoading && id) {
      const foundProduct = getProductById(id);
      setProduct(foundProduct);
    }
  }, [id, getProductById, productsLoading]);


  if (productsLoading || product === undefined) {
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

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Carousel className="w-full">
          <CarouselContent>
            {(product.images && product.images.length > 0 ? product.images : [product.image]).map((img, index) => (
              <CarouselItem key={index}>
                <Card className="overflow-hidden rounded-lg">
                  <CardContent className="p-0">
                    <Image
                      src={img}
                      alt={`${product.name} image ${index + 1}`}
                      data-ai-hint="product photo"
                      width={800}
                      height={1000}
                      className="w-full h-auto aspect-[4/5] object-cover"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <div className="prose text-foreground/80">
            <p>{product.description}</p>
          </div>
          <ProductDetailsClient product={product} />
        </div>
      </div>
    </div>
  );
}
