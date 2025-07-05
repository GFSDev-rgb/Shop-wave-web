"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Pencil, Trash2 } from "lucide-react";
import React, { useRef, useState, useEffect } from 'react';
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
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();
  const { user } = useAuth();
  const { updateProduct, deleteProduct } = useProducts();

  const [isEditSheetOpen, setEditSheetOpen] = useState(false);
  const isAdmin = user?.email === 'emammahadi822@gmail.com';

  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, active: false });
  const mouseLeaveDelay = useRef<NodeJS.Timeout | null>(null);

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

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleAdminAction(e);
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} is now in your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleAdminAction(e);
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({ title: "Removed from wishlist" });
    } else {
      addToWishlist(product);
      toast({ title: "Added to wishlist" });
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
      handleAdminAction(e);
      await deleteProduct(product.id);
      toast({
          variant: "destructive",
          title: "Product Deleted",
          description: `"${product.name}" has been removed.`,
      })
  }

  const handleUpdate = async (data: any) => {
    await updateProduct(product.id, data)
  }

  return (
    <Link href={`/product/${product.id}`} className="block">
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
                          <SheetDescription>Update the details for "{product.name}".</SheetDescription>
                      </SheetHeader>
                      <ProductForm 
                          product={product} 
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
                          "{product.name}".
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
              <Heart className={cn("h-5 w-5", isInWishlist(product.id) ? "text-red-500 fill-current" : "text-foreground/80")} />
            </Button>
          )}

          <div
            className="card-bg"
            data-ai-hint="product photo"
            style={{ ...cardBgTransform, backgroundImage: `url(${product.image})` }}
          />
          <div className="card-info">
            <p className="card-category text-sm text-muted-foreground mb-1">{product.category}</p>
            <h3 className="card-title">{product.name}</h3>
            <p className="card-price">${product.price.toFixed(2)}</p>
            <div className="card-buttons">
                <Button onClick={handleAddToCart} variant="secondary" className="w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
