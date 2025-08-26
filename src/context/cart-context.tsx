
"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import type { CartItem, Product } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useProducts } from "@/hooks/use-products";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantityToAdd: number, size: string) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  loading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { products, loading: productsLoading } = useProducts();

  const updateCartState = useCallback(async (newCartItems: CartItem[]) => {
    setCartItems(newCartItems);
    const simplifiedCart = newCartItems.map(({ id, product, quantity, size }) => ({
      id,
      productId: product.id,
      quantity,
      size,
    }));

    if (user && db) {
      const cartDocRef = doc(db, "carts", user.uid);
      await setDoc(cartDocRef, { items: simplifiedCart });
    } else {
      localStorage.setItem("cart", JSON.stringify(simplifiedCart));
    }
  }, [user]);

  const loadCart = useCallback(async (cartData: any) => {
    if (productsLoading) return;

    // Ensure cartData is an array before mapping
    const dataToProcess = Array.isArray(cartData) ? cartData : [];

    const loadedCartItems: CartItem[] = dataToProcess
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          return {
            id: item.id || `${item.productId}-${item.size}`,
            product,
            quantity: item.quantity,
            size: item.size,
          };
        }
        return null;
      })
      .filter((item): item is CartItem => item !== null);
    setCartItems(loadedCartItems);
  }, [products, productsLoading]);

  // Effect to load cart from localStorage for guest users
  useEffect(() => {
    if (!user && !authLoading) {
      const storedCartRaw = localStorage.getItem("cart");
      if (storedCartRaw) {
        try {
          const storedCart = JSON.parse(storedCartRaw);
          loadCart(storedCart);
        } catch (error) {
          console.error("Error parsing cart from localStorage", error);
          localStorage.removeItem("cart");
        }
      }
      setIsContextLoaded(true);
    }
  }, [user, authLoading, loadCart]);

  // Effect to sync cart with Firestore for logged-in users.
  useEffect(() => {
    if (user && db) {
      const cartDocRef = doc(db, "carts", user.uid);
      
      const syncLocalToFirestore = async () => {
        const localCartRaw = localStorage.getItem("cart");
        if (localCartRaw) {
          try {
            const localCart = JSON.parse(localCartRaw);
            localStorage.removeItem("cart");

            if (Array.isArray(localCart) && localCart.length > 0) {
              const docSnap = await getDoc(cartDocRef);
              const remoteCart = docSnap.exists() ? (docSnap.data().items as any[]) : [];
              
              const mergedCart = [...remoteCart];
              localCart.forEach(localItem => {
                const existingItemIndex = mergedCart.findIndex(
                  remoteItem => remoteItem.productId === localItem.productId && remoteItem.size === localItem.size
                );
                if (existingItemIndex > -1) {
                  mergedCart[existingItemIndex].quantity += localItem.quantity;
                } else {
                  mergedCart.push(localItem);
                }
              });
              
              await setDoc(cartDocRef, { items: mergedCart }, { merge: true });
            }
          } catch (error) {
             console.error("Error syncing local cart to Firestore", error);
          }
        }
      };

      syncLocalToFirestore();

      const unsubscribe = onSnapshot(cartDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data().items || [];
          loadCart(remoteData);
        } else {
          setCartItems([]);
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
  }, [user, loadCart]);
  
  const addToCart = useCallback(async (product: Product, quantityToAdd: number = 1, size: string = 'One Size') => {
    const cartItemId = `${product.id}-${size}`;
    const existingItemIndex = cartItems.findIndex(item => item.id === cartItemId);
    let newCartItems = [...cartItems];

    if (existingItemIndex > -1) {
      newCartItems[existingItemIndex].quantity += quantityToAdd;
    } else {
      newCartItems.push({ id: cartItemId, product, quantity: quantityToAdd, size });
    }
    await updateCartState(newCartItems);
  }, [cartItems, updateCartState]);

  const removeFromCart = useCallback(async (cartItemId: string) => {
    const newCartItems = cartItems.filter(item => item.id !== cartItemId);
    await updateCartState(newCartItems);
  }, [cartItems, updateCartState]);
  
  const updateQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
    } else {
      const newCartItems = cartItems.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      );
      await updateCartState(newCartItems);
    }
  }, [cartItems, updateCartState, removeFromCart]);

  const clearCart = useCallback(async () => {
    await updateCartState([]);
  }, [updateCartState]);

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

    