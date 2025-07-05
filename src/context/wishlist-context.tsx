"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { Product } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { useProducts } from "@/hooks/use-products";

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { user, loading: authLoading } = useAuth();
  const { products, loading: productsLoading } = useProducts();

  // Load from localStorage for guests
  useEffect(() => {
    if (!user && !authLoading) {
      const storedWishlistRaw = localStorage.getItem("wishlist");
      if (storedWishlistRaw) {
        try {
          const storedProducts: Product[] = JSON.parse(storedWishlistRaw);
          setWishlistIds(storedProducts.map(p => p.id));
        } catch (error) {
          console.error("Error parsing wishlist from localStorage", error);
          localStorage.removeItem("wishlist");
        }
      }
    }
  }, [user, authLoading]);
  
  // Sync with Firestore for logged-in users
  useEffect(() => {
    if (user) {
      const wishlistDocRef = doc(db, "wishlists", user.uid);
      
      const syncLocalToFirestore = async () => {
        const localWishlistRaw = localStorage.getItem("wishlist");
        if (localWishlistRaw) {
          try {
            const localProducts: Product[] = JSON.parse(localWishlistRaw);
            localStorage.removeItem("wishlist");

            if (localProducts.length > 0) {
              const docSnap = await getDoc(wishlistDocRef);
              const remoteIds = docSnap.exists() ? (docSnap.data().productIds as string[]) : [];
              const localIds = localProducts.map(p => p.id);
              const mergedIds = [...new Set([...remoteIds, ...localIds])];
              await setDoc(wishlistDocRef, { productIds: mergedIds }, { merge: true });
            }
          } catch(error) {
              console.error("Error syncing local wishlist to Firestore", error);
          }
        }
      };
      
      syncLocalToFirestore();
      
      const unsubscribe = onSnapshot(wishlistDocRef, (snapshot) => {
        if (snapshot.exists()) {
          setWishlistIds(snapshot.data().productIds || []);
        } else {
          setWishlistIds([]);
        }
      }, (error) => {
        console.error("Error with wishlist snapshot listener:", error);
      });
      return unsubscribe;
    }
  }, [user]);

  const updateWishlist = useCallback(async (newWishlistIds: string[]) => {
    setWishlistIds(newWishlistIds);
    if (user) {
      const wishlistDocRef = doc(db, "wishlists", user.uid);
      await setDoc(wishlistDocRef, { productIds: newWishlistIds });
    } else {
      if (productsLoading) return; // Don't save if products aren't loaded
      const wishlistItemsForStorage = newWishlistIds
        .map(id => products.find(p => p.id === id))
        .filter((p): p is Product => !!p);
      localStorage.setItem("wishlist", JSON.stringify(wishlistItemsForStorage));
    }
  }, [user, products, productsLoading]);

  const addToWishlist = (product: Product) => {
    if (wishlistIds.includes(product.id)) return;
    const newIds = [...wishlistIds, product.id];
    updateWishlist(newIds);
  };

  const removeFromWishlist = (productId: string) => {
    const newIds = wishlistIds.filter((id) => id !== productId);
    updateWishlist(newIds);
  };

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };
  
  const wishlistItems: Product[] = wishlistIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
