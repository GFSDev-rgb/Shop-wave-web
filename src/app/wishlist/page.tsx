
"use client";

import { useWishlist } from "@/hooks/use-wishlist";
import ProductCard from "@/components/product-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";


export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { wishlistItems, loading: wishlistLoading } = useWishlist();
  const router = useRouter();

  const loading = authLoading || wishlistLoading;

  if (loading) {
      return (
          <div className="container mx-auto px-4 py-12">
            <header className="text-center mb-12">
              <Skeleton className="h-12 w-1/3 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col space-y-3">
                      <Skeleton className="h-[400px] w-full rounded-lg" />
                  </div>
              ))}
            </div>
          </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
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
          <p className="mt-2 text-muted-foreground">
            {user ? "Explore our collections and save your favorites." : "Log in to see your wishlist."}
          </p>
          <Button asChild className="mt-6">
            <Link href={user ? "/shop" : "/welcome/start"}>{user ? "Discover Products" : "Get Started"}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
