
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useLikes } from "@/hooks/use-likes";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { Heart, Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastAction } from "@/components/ui/toast";
import { PlantButton } from "@/components/ui/plant-button";
import { useAuth } from "@/hooks/use-auth";

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isLiked, toggleLike, loading: likeLoading } = useLikes();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const isInCart = cartItems.some((item) => item.product.id === product.id);

  const showLoginToast = () => {
    toast({
        variant: 'destructive',
        title: "Login Required",
        description: "You need to be logged in to perform this action.",
        action: <ToastAction altText="Login" onClick={() => router.push('/login')}>Login</ToastAction>,
    });
  };

  const handleAddToCart = async () => {
    if (!user) {
      showLoginToast();
      return;
    }
    if (isInCart) {
      router.push("/cart");
      return;
    }

    await addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (!user) {
      showLoginToast();
      return;
    }
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

  const handleLikeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      showLoginToast();
      return;
    }
    toggleLike(product.id);
  }

  return (
    <div className="space-y-6">
      {!isInCart && (
        <div className="flex items-center gap-4">
          <p>Quantity:</p>
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <Button size="lg" onClick={handleAddToCart} className="flex-1 min-w-[200px]">
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isInCart ? "View in Cart" : "Add to Cart"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleWishlistToggle}
          className="flex-1 min-w-[200px]"
        >
          <Heart
            className={cn(
              "mr-2 h-5 w-5",
              isInWishlist(product.id) && "text-yellow-400 fill-current"
            )}
          />
          {isInWishlist(product.id)
            ? "In Wishlist"
            : "Add to Wishlist"}
        </Button>
        <PlantButton
          onClick={handleLikeToggle}
          isLiked={isLiked(product.id)}
          disabled={likeLoading}
        />
      </div>
    </div>
  );
}
