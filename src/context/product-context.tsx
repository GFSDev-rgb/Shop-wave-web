"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { Product } from "@/lib/types";
import { products as initialProducts } from "@/lib/data";

interface ProductContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'rating' | 'reviews' | 'images'> & {image: string}) => void;
  updateProduct: (productId: string, productData: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (productId: string) => void;
  getProductById: (productId: string) => Product | undefined;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem("products");
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        // If nothing in local storage, initialize with static data
        localStorage.setItem("products", JSON.stringify(initialProducts));
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      // Fallback to initial data if localStorage is unavailable
      setProducts(initialProducts);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("products", JSON.stringify(products));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, [products]);

  const addProduct = useCallback((productData: Omit<Product, 'id' | 'rating' | 'reviews' | 'images'> & {image: string}) => {
    setProducts((prevProducts) => {
      const newProduct: Product = {
        ...productData,
        id: new Date().toISOString(), // Simple unique ID
        rating: 0,
        reviews: 0,
        images: [productData.image], // Use the main image as the only image in the array
      };
      return [...prevProducts, newProduct];
    });
  }, []);

  const updateProduct = useCallback((productId: string, productData: Partial<Omit<Product, 'id'>>) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, ...productData, images: productData.image ? [productData.image] : p.images } : p
      )
    );
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p.id !== productId)
    );
  }, []);

  const getProductById = useCallback((productId: string) => {
    return products.find(p => p.id === productId);
  }, [products]);


  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, getProductById }}
    >
      {children}
    </ProductContext.Provider>
  );
};
