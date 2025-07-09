
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import dynamic from "next/dynamic";
import ProductDetailsClient from "./product-details-client";
import { Star, Pencil, ThumbsUp, User } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useProducts } from "@/hooks/use-products";
import type { Product } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const ProductForm = dynamic(() => import('@/components/admin/product-form'), {
  loading: () => (
    <div className="space-y-8 p-1 mt-6">
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-5 w-32 mt-4" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full mt-2" />
          </div>
          <div>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full mt-2" />
          </div>
        </div>
      </div>
    </div>
  ),
});

function ProductPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
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

export default function ProductView({ initialProduct }: { initialProduct: Product }) {
  const { products } = useProducts();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [product, setProduct] = useState<Product>(initialProduct);
  const [isEditSheetOpen, setEditSheetOpen] = useState(false);

  // This effect ensures the product data on this page is always in sync 
  // with the global state from the context.
  useEffect(() => {
    const updatedProductFromContext = products.find(p => p.id === initialProduct.id);
    if (updatedProductFromContext) {
      setProduct(updatedProductFromContext);
    }
  }, [products, initialProduct.id]);

  if (authLoading) {
      return <ProductPageSkeleton />;
  }

  if (!product) {
      return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
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
                      priority={index === 0}
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
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold mt-1">{product.name}</h1>
              </div>
              {isAdmin && (
                <Sheet open={isEditSheetOpen} onOpenChange={setEditSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline">
                            <Pencil className="mr-2 h-4 w-4"/>
                            Edit
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-background/80 backdrop-blur-sm border-l p-6 w-full max-w-md overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>Edit Product</SheetTitle>
                            <SheetDescription>Update the details for "{product.name}".</SheetDescription>
                        </SheetHeader>
                        <ProductForm 
                            product={product} 
                            onFinished={() => setEditSheetOpen(false)} 
                        />
                    </SheetContent>
                </Sheet>
              )}
            </div>

            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
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
              <span>({product.reviews} reviews)</span>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4 text-primary" />
                  <span>{(product.likeCount || 0).toLocaleString()} likes</span>
              </div>
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <div className="prose dark:prose-invert text-foreground/80">
            <p>{product.description}</p>
          </div>
          <ProductDetailsClient product={product} />
        </div>
      </div>
    </div>
  );
}
