
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useLikes } from "@/hooks/use-likes";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { Heart, Minus, Plus, ShoppingCart, Loader2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastAction } from "@/components/ui/toast";
import { PlantButton } from "@/components/ui/plant-button";
import { useAuth } from "@/hooks/use-auth";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart, cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isLiked, toggleLike, loading: likeLoading } = useLikes();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const hasSizes = product.sizes && product.sizes.length > 0;
  const cartItem = cartItems.find(
    (item) => item.product.id === product.id && item.size === selectedSize
  );
  const isInCart = !!cartItem;

  const showLoginToast = () => {
    toast({
        variant: 'destructive',
        title: "Login Required",
        description: "You need to be logged in to perform this action.",
        action: <ToastAction altText="Get Started" onClick={() => router.push('/auth')}>Get Started</ToastAction>,
    });
  };

  const validateSelection = () => {
    if (hasSizes && !selectedSize) {
        toast({
            variant: 'destructive',
            title: 'Please select a size',
        });
        return false;
    }
    return true;
  }

  const handleAddToCart = async () => {
    if (!user) {
      showLoginToast();
      return;
    }
    if (!validateSelection()) return;

    if (isInCart) {
      router.push("/cart");
      return;
    }

    // `selectedSize` will be non-null here if `hasSizes` is true because of `validateSelection`
    const size = hasSizes ? selectedSize! : 'One Size';
    
    await addToCart(product, quantity, size);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} (Size: ${size}) added to your cart.`,
    });
  };

  const handleOrderNow = () => {
    if (!user) {
        showLoginToast();
        return;
    }
    if (!validateSelection()) return;
    
    const size = hasSizes ? selectedSize! : 'One Size';
    router.push(`/order/${product.id}?quantity=${quantity}&size=${encodeURIComponent(size)}`);
  }

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
       {hasSizes && (
         <div className="space-y-4">
          <Label className="text-base font-medium">Select Size:</Label>
           <RadioGroup
            value={selectedSize ?? undefined}
            onValueChange={setSelectedSize}
            className="flex flex-wrap gap-2"
          >
            {product.sizes?.map((size) => (
              <div key={size} className="flex items-center">
                <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                <Label
                  htmlFor={`size-${size}`}
                  className={cn(
                    "cursor-pointer rounded-md border px-4 py-2 transition-colors",
                    selectedSize === size
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent hover:bg-accent"
                  )}
                >
                  {size}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

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
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button size="lg" onClick={handleAddToCart} className="w-full">
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isInCart ? "View in Cart" : "Add to Cart"}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={handleOrderNow}
              className="w-full"
            >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Order Now
            </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
                size="lg"
                variant="outline"
                onClick={handleWishlistToggle}
                className="w-full"
            >
                <Heart
                    className={cn(
                    "mr-2 h-5 w-5",
                    isInWishlist(product.id) && "text-red-500 fill-current"
                    )}
                />
                {isInWishlist(product.id)
                    ? "In Wishlist"
                    : "Add to Wishlist"}
            </Button>
            <div className="flex items-center justify-start gap-4 pt-2">
                <PlantButton
                    onClick={handleLikeToggle}
                    isLiked={isLiked(product.id)}
                    disabled={likeLoading}
                    size="lg"
                    className="border rounded-full"
                />
                <span className="text-sm text-muted-foreground">Like this product</span>
            </div>
        </div>
      </div>
    </div>
  );
}
