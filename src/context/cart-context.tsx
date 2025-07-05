"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import type { CartItem, Product } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useProducts } from "@/hooks/use-products";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantityToAdd?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  loading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

// A map of productId to quantity
type CartState = Record<string, number>;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartState, setCartState] = useState<CartState>({});
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { products, loading: productsLoading } = useProducts();

  // Effect to load cart from localStorage for guest users
  useEffect(() => {
    if (!user && !authLoading) {
      const storedCartRaw = localStorage.getItem("cart");
      if (storedCartRaw) {
        try {
          const loadedState: CartState = JSON.parse(storedCartRaw);
          setCartState(loadedState);
        } catch (error) {
          console.error("Error parsing cart from localStorage", error);
          localStorage.removeItem("cart");
        }
      }
      setIsContextLoaded(true);
    }
  }, [user, authLoading]);

  // Effect to sync cart with Firestore for logged-in users
  useEffect(() => {
    if (user && db) {
      const cartDocRef = doc(db, "carts", user.uid);
      
      const syncLocalToFirestore = async () => {
        const localCartRaw = localStorage.getItem("cart");
        if (localCartRaw) {
          try {
            const localCartState: CartState = JSON.parse(localCartRaw);
            localStorage.removeItem("cart");

            if (Object.keys(localCartState).length > 0) {
              const docSnap = await getDoc(cartDocRef);
              const remoteState = docSnap.exists() ? (docSnap.data().items as CartState) : {};
              
              // Merge local cart into remote cart
              Object.entries(localCartState).forEach(([productId, quantity]) => {
                remoteState[productId] = (remoteState[productId] || 0) + quantity;
              });
              
              await setDoc(cartDocRef, { items: remoteState }, { merge: true });
            }
          } catch (error) {
             console.error("Error syncing local cart to Firestore", error);
          }
        }
      };

      syncLocalToFirestore();

      const unsubscribe = onSnapshot(cartDocRef, (snapshot) => {
        if (snapshot.exists()) {
          setCartState(snapshot.data().items || {});
        } else {
          setCartState({});
        }
        setIsContextLoaded(true);
      }, (error) => {
        console.error("Error with cart snapshot listener:", error);
        setIsContextLoaded(true);
      });
      return unsubscribe;
    } else if (user && !db) {
        console.warn("Firestore not available, cart will not be synced for logged in user.")
    }
  }, [user]);
  
  const updateCart = useCallback(async (newCartState: CartState) => {
    setCartState(newCartState);
    if (user && db) {
        const cartDocRef = doc(db, "carts", user.uid);
        await setDoc(cartDocRef, { items: newCartState });
    } else {
        localStorage.setItem("cart", JSON.stringify(newCartState));
    }
  }, [user]);

  const addToCart = useCallback(async (product: Product, quantityToAdd: number = 1) => {
    const newState = { ...cartState };
    newState[product.id] = (newState[product.id] || 0) + quantityToAdd;
    await updateCart(newState);
  }, [cartState, updateCart]);

  const removeFromCart = useCallback(async (productId: string) => {
    const newState = { ...cartState };
    delete newState[productId];
    await updateCart(newState);
  }, [cartState, updateCart]);
  
  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
    } else {
      const newState = { ...cartState };
      newState[productId] = quantity;
      await updateCart(newState);
    }
  }, [cartState, updateCart, removeFromCart]);

  const clearCart = useCallback(async () => {
    await updateCart({});
  }, [updateCart]);

  const cartItems: CartItem[] = useMemo(() => {
    if (productsLoading) return [];
    return Object.entries(cartState)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p.id === productId);
        return product ? { product, quantity } : null;
      })
      .filter((item): item is CartItem => item !== null);
  }, [cartState, products, productsLoading]);

  const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

  const cartTotal = useMemo(() => cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  ), [cartItems]);

  const loading = authLoading || productsLoading || !isContextLoaded;

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
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
