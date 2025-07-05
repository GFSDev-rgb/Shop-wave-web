"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { Product } from "@/lib/types";
import { products as initialProducts } from "@/lib/data";
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc
} from "firebase/firestore";

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
  addProduct: (productData: ProductFormData) => Promise<void>;
  updateProduct: (productId: string, productData: ProductFormData) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    if (!db) {
        console.warn("Firestore is not initialized. Using local product data.");
        setProducts(initialProducts);
        setLoading(false);
        return;
    }

    try {
      const productsCollectionRef = collection(db, "products");
      const data = await getDocs(productsCollectionRef);

      // Seed database if it's empty
      if (data.empty && initialProducts.length > 0) {
        for (const product of initialProducts) {
          const { id, ...productData } = product; // Firestore will generate its own ID
          await addDoc(productsCollectionRef, productData);
        }
        // Refetch after seeding
        const seededData = await getDocs(productsCollectionRef);
        const seededProducts = seededData.docs.map((doc) => ({
            ...(doc.data() as Omit<Product, 'id'>),
            id: doc.id,
        }));
        setProducts(seededProducts);
      } else {
        const fetchedProducts = data.docs.map((doc) => ({
          ...(doc.data() as Omit<Product, 'id'>),
          id: doc.id,
        }));
        setProducts(fetchedProducts);
      }
    } catch (error) {
      console.error("Error fetching products from Firestore:", error);
      // Fallback to local data on error
      setProducts(initialProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (productData: ProductFormData) => {
    if (!db) {
        console.error("Cannot add product, Firestore is not configured.");
        return;
    }
    const productsCollectionRef = collection(db, "products");
    const { image1, image2, image3, ...rest } = productData;
    const images = [image1, image2, image3].filter((img): img is string => !!img && img.trim() !== '');
    const newProductData = {
      ...rest,
      rating: 0,
      reviews: 0,
      image: image1,
      images: images,
    };
    await addDoc(productsCollectionRef, newProductData);
    await fetchProducts(); // Refetch to update UI
  }, [fetchProducts]);

  const updateProduct = useCallback(async (productId: string, productData: ProductFormData) => {
    if (!db) {
        console.error("Cannot update product, Firestore is not configured.");
        return;
    }
    const productDoc = doc(db, "products", productId);
    const { image1, image2, image3, ...rest } = productData;
    const images = [image1, image2, image3].filter((img): img is string => !!img && img.trim() !== '');
    const updatedData = {
      ...rest,
      image: image1,
      images: images,
    };
    await updateDoc(productDoc, updatedData);
    await fetchProducts(); // Refetch to update UI
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (productId: string) => {
    if (!db) {
        console.error("Cannot delete product, Firestore is not configured.");
        return;
    }
    const productDoc = doc(db, "products", productId);
    await deleteDoc(productDoc);
    await fetchProducts(); // Refetch to update UI
  }, [fetchProducts]);

  return (
    <ProductContext.Provider
      value={{ products, loading, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};
