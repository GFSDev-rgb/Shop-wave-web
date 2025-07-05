"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
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
  loading: boolean;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { products, loading: productsLoading } = useProducts();

  // Load from localStorage for guests
  useEffect(() => {
    if (!user && !authLoading) {
      const storedWishlistRaw = localStorage.getItem("wishlist");
      if (storedWishlistRaw) {
        try {
          const storedIds: string[] = JSON.parse(storedWishlistRaw);
          setWishlistIds(storedIds);
        } catch (error) {
          console.error("Error parsing wishlist from localStorage", error);
          localStorage.removeItem("wishlist");
        }
      }
      setIsContextLoaded(true);
    }
  }, [user, authLoading]);
  
  // Sync with Firestore for logged-in users.
  // The wishlist for a user is stored in a document inside the 'wishlists' collection,
  // with the document ID being the user's UID for data isolation.
  useEffect(() => {
    if (user && db) {
      const wishlistDocRef = doc(db, "wishlists", user.uid);
      
      const syncLocalToFirestore = async () => {
        const localWishlistRaw = localStorage.getItem("wishlist");
        if (localWishlistRaw) {
          try {
            const localIds: string[] = JSON.parse(localWishlistRaw);
            localStorage.removeItem("wishlist");

            if (localIds.length > 0) {
              const docSnap = await getDoc(wishlistDocRef);
              const remoteIds = docSnap.exists() ? (docSnap.data().productIds as string[]) : [];
              // Merge and deduplicate IDs from guest session and Firestore
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
        setIsContextLoaded(true);
      }, (error) => {
        console.error("Error with wishlist snapshot listener:", error);
        setIsContextLoaded(true);
      });
      return unsubscribe;
    } else if (user && !db) {
        console.warn("Firestore not available, wishlist will not be synced for logged in user.")
    }
  }, [user]);

  const updateWishlist = useCallback(async (newWishlistIds: string[]) => {
    setWishlistIds(newWishlistIds);
    if (user && db) {
      const wishlistDocRef = doc(db, "wishlists", user.uid);
      await setDoc(wishlistDocRef, { productIds: newWishlistIds });
    } else {
      localStorage.setItem("wishlist", JSON.stringify(newWishlistIds));
    }
  }, [user]);

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
  
  const wishlistItems: Product[] = useMemo(() => {
    if (productsLoading) return [];
    return wishlistIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined);
  }, [wishlistIds, products, productsLoading]);

  const loading = authLoading || productsLoading || !isContextLoaded;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: wishlistItems.length,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
