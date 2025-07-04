"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import React, { useRef, useState, useEffect } from 'react';

import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
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

  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, active: false });
  const mouseLeaveDelay = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // This cleans up the timeout when the component unmounts, preventing memory leaks and HMR issues.
    return () => {
      if (mouseLeaveDelay.current) {
        clearTimeout(mouseLeaveDelay.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    setMouse({ x, y, active: true });
  };

  const handleMouseEnter = () => {
    if (mouseLeaveDelay.current) {
      clearTimeout(mouseLeaveDelay.current);
    }
    setMouse(prev => ({ ...prev, active: true }));
  };

  const handleMouseLeave = () => {
    mouseLeaveDelay.current = setTimeout(() => {
      setMouse({ x: 0, y: 0, active: false });
    }, 1000);
  };
  
  const mousePX = mouse.x / (cardRef.current?.offsetWidth || 1);
  const mousePY = mouse.y / (cardRef.current?.offsetHeight || 1);

  const cardStyle = {
    transform: mouse.active ? `rotateY(${mousePX * 20}deg) rotateX(${-mousePY * 20}deg)` : 'rotateY(0deg) rotateX(0deg)',
  };

  const cardBgTransform = {
    transform: mouse.active ? `translateX(${mousePX * -20}px) translateY(${mousePY * -20}px)` : 'translateX(0px) translateY(0px)',
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} is now in your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
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
    <Link href={`/product/${product.id}`} className="block">
      <div
        className={cn("card-wrap", className)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={cardRef}
      >
        <div className="card" style={cardStyle}>
          <div
            className="card-bg"
            data-ai-hint="product photo"
            style={{ ...cardBgTransform, backgroundImage: `url(${product.image})` }}
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 rounded-full h-9 w-9 bg-background/50 hover:bg-background z-20 transition-opacity duration-300 card-heart"
            onClick={handleWishlistToggle}
          >
            <Heart className={cn("h-5 w-5", isInWishlist(product.id) ? "text-red-500 fill-current" : "text-foreground/80")} />
          </Button>
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
