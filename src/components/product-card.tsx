"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} is now in your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <Card className={cn("group overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col", className)}>
      <CardHeader className="p-0 relative overflow-hidden">
        <Link href={`/product/${product.id}`} className="block">
          <Image
            src={product.image}
            alt={product.name}
            data-ai-hint="product photo"
            width={600}
            height={800}
            className="w-full h-auto aspect-[3/4] object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-3 right-3 rounded-full h-9 w-9 bg-background/70 hover:bg-background z-10"
          onClick={handleWishlistToggle}
        >
          <Heart className={cn("h-5 w-5", isInWishlist(product.id) ? "text-red-500 fill-current" : "text-foreground/80")} />
        </Button>
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-10">
            <Button onClick={handleAddToCart} variant="secondary" className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
            </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        <div>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <Link href={`/product/${product.id}`} className="block">
                <CardTitle className="text-lg font-body font-bold mt-1 leading-tight hover:text-primary transition-colors">
                    {product.name}
                </CardTitle>
            </Link>
        </div>
        <p className="text-xl font-bold text-primary mt-2">${product.price.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}
