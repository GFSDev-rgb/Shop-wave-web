"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { CartItem, Product } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useProducts } from "@/hooks/use-products";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

// A map of productId to quantity
type CartState = Record<string, number>;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartState, setCartState] = useState<CartState>({});
  const { user, loading: authLoading } = useAuth();
  const { products, loading: productsLoading } = useProducts();

  // Effect to load cart from localStorage for guest users
  useEffect(() => {
    if (!user && !authLoading) {
      const storedCartRaw = localStorage.getItem("cart");
      if (storedCartRaw) {
        try {
          // The old format stored an array of CartItem objects
          const storedCartItems: CartItem[] = JSON.parse(storedCartRaw);
          const loadedState = storedCartItems.reduce((acc, item) => {
            acc[item.product.id] = item.quantity;
            return acc;
          }, {} as CartState);
          setCartState(loadedState);
        } catch (error) {
          console.error("Error parsing cart from localStorage", error);
          localStorage.removeItem("cart"); // Clear corrupted data
        }
      }
    }
  }, [user, authLoading]);

  // Effect to sync cart with Firestore for logged-in users
  useEffect(() => {
    if (user) {
      const cartDocRef = doc(db, "carts", user.uid);
      
      const syncLocalToFirestore = async () => {
        const localCartRaw = localStorage.getItem("cart");
        if (localCartRaw) {
          try {
            const localCartItems: CartItem[] = JSON.parse(localCartRaw);
            localStorage.removeItem("cart"); // Clear local cart after syncing

            if (localCartItems.length > 0) {
              const docSnap = await getDoc(cartDocRef);
              const remoteState = docSnap.exists() ? (docSnap.data().items as CartState) : {};
              
              localCartItems.forEach(item => {
                remoteState[item.product.id] = (remoteState[item.product.id] || 0) + item.quantity;
              });
              
              await setDoc(cartDocRef, { items: remoteState }, { merge: true });
            }
          } catch (error) {
             console.error("Error syncing local cart to Firestore", error);
          }
        }
      };

      syncLocalToFirestore();

      // Listen for realtime updates from Firestore
      const unsubscribe = onSnapshot(cartDocRef, (snapshot) => {
        if (snapshot.exists()) {
          setCartState(snapshot.data().items || {});
        } else {
          setCartState({});
        }
      }, (error) => {
        console.error("Error with cart snapshot listener:", error);
      });
      return unsubscribe; // Cleanup listener on component unmount or user change
    }
  }, [user]);
  
  const updateCart = useCallback(async (newCartState: CartState) => {
      setCartState(newCartState);
      if (user) {
          const cartDocRef = doc(db, "carts", user.uid);
          await setDoc(cartDocRef, { items: newCartState });
      } else {
          if (productsLoading) return; // Don't save if products aren't loaded yet
          const cartItemsForStorage: CartItem[] = Object.entries(newCartState)
            .map(([productId, quantity]) => {
                const product = products.find(p => p.id === productId);
                return product ? { product, quantity } : null;
            })
            .filter((item): item is CartItem => !!item);
          localStorage.setItem("cart", JSON.stringify(cartItemsForStorage));
      }
  }, [user, products, productsLoading]);

  const addToCart = (product: Product) => {
    const newState = { ...cartState };
    newState[product.id] = (newState[product.id] || 0) + 1;
    updateCart(newState);
  };

  const removeFromCart = (productId: string) => {
    const newState = { ...cartState };
    delete newState[productId];
    updateCart(newState);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      const newState = { ...cartState };
      newState[productId] = quantity;
      updateCart(newState);
    }
  };

  const clearCart = () => {
    updateCart({});
  };

  const cartItems: CartItem[] = Object.entries(cartState)
    .map(([productId, quantity]) => {
      const product = products.find((p) => p.id === productId);
      return product ? { product, quantity } : null;
    })
    .filter((item): item is CartItem => item !== null && item.product !== undefined);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
