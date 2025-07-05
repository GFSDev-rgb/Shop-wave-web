
"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Pencil, Trash2 } from "lucide-react";
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
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
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useProducts } from "@/hooks/use-products";
import ProductForm from "@/components/admin/product-form";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart, cartItems } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const { updateProduct, deleteProduct } = useProducts();
  const router = useRouter();

  const [localProduct, setLocalProduct] = useState<Product>(product);
  const [isEditSheetOpen, setEditSheetOpen] = useState(false);

  // This effect ensures the card's local state is in sync with the global state
  // that is passed down via props.
  useEffect(() => {
    setLocalProduct(product);
  }, [product]);

  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, active: false });
  const mouseLeaveDelay = useRef<NodeJS.Timeout | null>(null);
  
  const isInCart = cartItems.some(item => item.product.id === localProduct.id);

  useEffect(() => {
    return () => {
      if (mouseLeaveDelay.current) {
        clearTimeout(mouseLeaveDelay.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isAdmin) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    setMouse({ x, y, active: true });
  };

  const handleMouseEnter = () => {
    if (mouseLeaveDelay.current) clearTimeout(mouseLeaveDelay.current);
    if(isAdmin) return;
    setMouse(prev => ({ ...prev, active: true }));
  };

  const handleMouseLeave = () => {
    if(isAdmin) return;
    mouseLeaveDelay.current = setTimeout(() => {
      setMouse({ x: 0, y: 0, active: false });
    }, 1000);
  };
  
  const mousePX = mouse.x / (cardRef.current?.offsetWidth || 1);
  const mousePY = mouse.y / (cardRef.current?.offsetHeight || 1);

  const cardStyle = {
    transform: mouse.active && !isAdmin ? `rotateY(${mousePX * 20}deg) rotateX(${-mousePY * 20}deg)` : 'rotateY(0deg) rotateX(0deg)',
  };

  const cardBgTransform = {
    transform: mouse.active && !isAdmin ? `translateX(${mousePX * -20}px) translateY(${mousePY * -20}px)` : 'translateX(0px) translateY(0px)',
  };

  const handleAdminAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCartAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    handleAdminAction(e);
    if (isInCart) {
      router.push('/cart');
    } else {
      await addToCart(localProduct);
      toast({
        title: "Added to cart",
        description: `${localProduct.name} is now in your cart.`,
      });
      router.push("/cart");
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleAdminAction(e);
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
      await deleteProduct(localProduct.id);
      toast({
          variant: "destructive",
          title: "Product Deleted",
          description: `"${localProduct.name}" has been removed.`,
      })
  }

  // The handler now simply calls the update function from the context.
  // The form will handle loading states and success/error toasts.
  const handleUpdate = async (data: any) => {
    await updateProduct(localProduct.id, data);
  }

  return (
    <Link href={`/product/${localProduct.id}`} className="block">
      <div
        className={cn("card-wrap", className)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={cardRef}
      >
        <div className="card" style={cardStyle}>
          {isAdmin ? (
            <div className="absolute top-2 right-2 z-20 flex gap-2" onClick={handleAdminAction}>
              <Sheet open={isEditSheetOpen} onOpenChange={setEditSheetOpen}>
                  <SheetTrigger asChild>
                      <Button size="icon" variant="secondary" className="rounded-full h-9 w-9 bg-background/50 hover:bg-background z-20">
                          <Pencil className="h-4 w-4" />
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="bg-background/80 backdrop-blur-sm border-l border-white/10 p-6 w-full max-w-md overflow-y-auto">
                      <SheetHeader>
                          <SheetTitle>Edit Product</SheetTitle>
                          <SheetDescription>Update the details for "{localProduct.name}".</SheetDescription>
                      </SheetHeader>
                      <ProductForm 
                          product={localProduct} 
                          onSave={handleUpdate}
                          onFinished={() => setEditSheetOpen(false)} 
                      />
                  </SheetContent>
              </Sheet>
              <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <Button size="icon" variant="destructive" className="rounded-full h-9 w-9 bg-destructive/80 hover:bg-destructive z-20">
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
              className="absolute top-3 right-3 rounded-full h-9 w-9 bg-background/50 hover:bg-background z-20 transition-opacity duration-300 card-heart"
              onClick={handleWishlistToggle}
            >
              <Heart className={cn("h-5 w-5", isInWishlist(localProduct.id) ? "text-red-500 fill-current" : "text-foreground/80")} />
            </Button>
          )}

          <div
            className="card-bg"
            data-ai-hint="product photo"
            style={{ ...cardBgTransform, backgroundImage: `url(${localProduct.image})` }}
          />
          <div className="card-info">
            <p className="card-category text-sm text-muted-foreground mb-1">{localProduct.category}</p>
            <h3 className="card-title">{localProduct.name}</h3>
            <p className="card-price">${localProduct.price.toFixed(2)}</p>
            <div className="card-buttons">
                <Button onClick={handleCartAction} variant="secondary" className="w-full">
                  {isInCart ? 'View Cart' : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
