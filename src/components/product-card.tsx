
"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Pencil, Trash2 } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { ToastAction } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useLikes } from "@/hooks/use-likes";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useProducts } from "@/hooks/use-products";
import ProductForm from "@/components/admin/product-form";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, className }, ref) => {
    const { addToCart, cartItems } = useCart();
    const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
    const { toast } = useToast();
    const { isAdmin, user } = useAuth();
    const { deleteProduct } = useProducts();
    const router = useRouter();

    const [localProduct, setLocalProduct] = useState<Product>(product);
    const [isEditSheetOpen, setEditSheetOpen] = useState(false);

    useEffect(() => {
      setLocalProduct(product);
    }, [product]);

    const isInCart = cartItems.some(item => item.product.id === localProduct.id);

    const showLoginToast = () => {
        toast({
            variant: 'destructive',
            title: "Login Required",
            description: "You need to be logged in to perform this action.",
            action: <ToastAction altText="Get Started" onClick={() => router.push('/welcome/start')}>Get Started</ToastAction>,
        });
    };

    const handleAdminAction = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleCartAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
      handleAdminAction(e);
      if (!user) {
        showLoginToast();
        return;
      }
      if (isInCart) {
        router.push('/cart');
      } else {
        await addToCart(localProduct, 1, localProduct.sizes?.[0] || 'One Size');
        toast({
          title: "Added to cart",
          description: `${localProduct.name} is now in your cart.`,
        });
      }
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
      handleAdminAction(e);
      if (!user) {
        showLoginToast();
        return;
      }
      if (isInWishlist(localProduct.id)) {
        removeFromWishlist(localProduct.id);
        toast({ title: "Removed from wishlist" });
      } else {
        addToWishlist(localProduct);
        toast({ title: "Added to wishlist" });
      }
    };

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        handleAdminAction(e);
        try {
          await deleteProduct(localProduct.id);
          toast({
              variant: "destructive",
              title: "Product Deleted",
              description: `"${localProduct.name}" has been removed.`,
          })
        } catch (error: any) {
           toast({
              variant: "destructive",
              title: "Delete Failed",
              description: error.message || "Could not delete product.",
          })
        }
    }

    return (
      <div ref={ref} className={cn("product-card-container group/card", className)}>
        <div className="product-card">
          <Link href={`/product/${localProduct.id}`} className="product-card-image-link">
            <Image
              src={localProduct.image}
              alt={localProduct.name}
              data-ai-hint="product photo"
              width={400}
              height={500}
              className="product-card-image"
            />
          </Link>
          <div className="product-card-content">
            <div className="product-card-details">
                <Link href={`/product/${localProduct.id}`} className="hover:underline">
                    <h3 className="font-headline text-lg sm:text-base md:text-lg font-bold truncate">
                        {localProduct.name}
                    </h3>
                </Link>
                <p className="text-sm text-muted-foreground">{localProduct.category}</p>
                <p className="text-base sm:text-sm md:text-base font-bold text-primary mt-1">Tk {localProduct.price.toFixed(2)}</p>
            </div>
            
            <Button onClick={handleCartAction} className="mt-2 w-full shrink-0" size="sm">
              {isInCart ? 'View in Cart' : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
          
          {isAdmin ? (
            <div className="absolute top-2 right-2 z-20 flex gap-2" onClick={handleAdminAction}>
               <Sheet open={isEditSheetOpen} onOpenChange={setEditSheetOpen}>
                  <SheetTrigger asChild>
                      <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 bg-background/80 hover:bg-background z-20">
                          <Pencil className="h-4 w-4" />
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="bg-background/80 backdrop-blur-sm border-l p-6 w-full max-w-md overflow-y-auto">
                      <SheetHeader>
                          <SheetTitle>Edit Product</SheetTitle>
                          <SheetDescription>Update the details for "{localProduct.name}".</SheetDescription>
                      </SheetHeader>
                      <ProductForm 
                          product={localProduct} 
                          onFinished={() => setEditSheetOpen(false)} 
                      />
                  </SheetContent>
              </Sheet>
              <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <Button size="icon" variant="destructive" className="rounded-full h-8 w-8 bg-destructive/80 hover:bg-destructive z-20">
                          <Trash2 className="h-4 w-4" />
                      </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                      <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product
                          "{localProduct.name}".
                      </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 rounded-full h-8 w-8 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white z-20"
              onClick={handleWishlistToggle}
            >
              <Heart className={cn("h-4 w-4", isInWishlist(localProduct.id) ? "text-red-500 fill-current" : "text-white/80")} />
            </Button>
          )}
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
