
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProductDetailsClient from "./product-details-client";
import { Star, Pencil, Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
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
import ProductForm from "@/components/admin/product-form";
import { Separator } from "@/components/ui/separator";

export default function ProductView({ initialProduct }: { initialProduct: Product }) {
  const { products } = useProducts();
  const { isAdmin } = useAuth();
  // Use state to allow for optimistic updates by admins
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

  if (!product) {
      return null;
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
                <h1 className="font-headline text-4xl md:text-5xl font-bold mt-1">{product.name}</h1>
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
                  <Heart className="w-4 h-4" />
                  <span>{product.likeCount.toLocaleString()} likes</span>
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
