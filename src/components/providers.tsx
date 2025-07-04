"use client";

import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { Toaster } from "@/components/ui/toaster";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
          <Toaster />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
