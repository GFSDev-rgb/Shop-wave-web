"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { Product } from "@/lib/types";
import { products as initialProducts } from "@/lib/data";

// This is the shape of the data coming from the updated product form
interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image1: string;
  image2?: string;
  image3?: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (productData: ProductFormData) => void;
  updateProduct: (productId: string, productData: ProductFormData) => void;
  deleteProduct: (productId: string) => void;
  getProductById: (productId: string) => Product | undefined;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem("products");
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        // If nothing in local storage, initialize with static data
        setProducts(initialProducts);
        localStorage.setItem("products", JSON.stringify(initialProducts));
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      // Fallback to initial data if localStorage is unavailable
      setProducts(initialProducts);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
        try {
            localStorage.setItem("products", JSON.stringify(products));
        } catch (error) {
            console.error("Failed to save to localStorage:", error);
        }
    }
  }, [products, loading]);

  const addProduct = useCallback((productData: ProductFormData) => {
    setProducts((prevProducts) => {
      const { image1, image2, image3, ...rest } = productData;
      const images = [image1, image2, image3].filter((img): img is string => !!img && img.trim() !== '');
      const newProduct: Product = {
        ...rest,
        id: new Date().toISOString(), // Simple unique ID
        rating: 0,
        reviews: 0,
        image: image1,
        images: images,
      };
      return [...prevProducts, newProduct];
    });
  }, []);

  const updateProduct = useCallback((productId: string, productData: ProductFormData) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          const { image1, image2, image3, ...rest } = productData;
          const images = [image1, image2, image3].filter((img): img is string => !!img && img.trim() !== '');
          return {
            ...p,
            ...rest,
            image: image1,
            images: images,
          };
        }
        return p;
      })
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
      value={{ products, loading, addProduct, updateProduct, deleteProduct, getProductById }}
    >
      {children}
    </ProductContext.Provider>
  );
};
