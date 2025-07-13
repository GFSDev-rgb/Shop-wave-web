
"use client";

import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { ProductProvider } from "@/context/product-context";
import LenisProvider from "./lenis-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <Toaster />
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </ThemeProvider>
    </LenisProvider>
  );
}
