
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const router = useRouter();

  const isInCart = cartItems.some((item) => item.product.id === product.id);

  const handleAddToCart = async () => {
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
      <div className="flex flex-wrap gap-4">
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
              isInWishlist(product.id) && "text-red-500 fill-current"
            )}
          />
          {isInWishlist(product.id)
            ? "Remove from Wishlist"
            : "Add to Wishlist"}
        </Button>
      </div>
    </div>
  );
}
