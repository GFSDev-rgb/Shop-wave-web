"use client";

import { useWishlist } from "@/hooks/use-wishlist";
import ProductCard from "@/components/product-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">Your Wishlist</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your collection of favorite items.
        </p>
      </header>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-6 text-2xl font-semibold">Your wishlist is empty</h2>
          <p className="mt-2 text-muted-foreground">Explore our collections and save your favorites.</p>
          <Button asChild className="mt-6">
            <Link href="/shop">Discover Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
