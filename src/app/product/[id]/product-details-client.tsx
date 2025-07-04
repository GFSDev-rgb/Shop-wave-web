"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDetailsClientProps {
  product: Product;
  images?: string[]; // Make images optional
}

export default function ProductDetailsClient({ product, images }: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const handleAddToCart = () => {
    // A little more complex logic to add specific quantity
    for (let i = 0; i < quantity; i++) {
        addToCart(product);
    }
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to wishlist",
      });
    }
  };

  if (images) {
    return (
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((img, index) => (
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
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <p>Quantity:</p>
        <div className="flex items-center border rounded-md">
            <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center">{quantity}</span>
            <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
            </Button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" onClick={handleAddToCart} className="flex-1">
          <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
        </Button>
        <Button size="lg" variant="outline" onClick={handleWishlistToggle} className="flex-1">
          <Heart
            className={cn(
              "mr-2 h-5 w-5",
              isInWishlist(product.id) && "text-red-500 fill-current"
            )}
          />
          {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
        </Button>
      </div>
    </div>
  );
}
