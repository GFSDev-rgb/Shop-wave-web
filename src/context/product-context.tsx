
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
  doc,
} from "firebase/firestore";
import { formatProduct } from "@/lib/utils";

// This is the shape of the data coming from the updated product form
interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  sizes?: string[];
  image1: string;
  image2?: string;
  image3?: string;
}

interface ProductContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  loading: boolean;
  addProduct: (productData: ProductFormData) => Promise<void>;
  updateProduct: (productId: string, productData: Partial<ProductFormData>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

/**
 * Provides product data to the application.
 * It fetches products from Firestore and handles CRUD operations.
 * If Firestore is empty, it will automatically seed the database with initial data.
 */
export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches all products from the 'products' collection in Firestore.
   * If the collection is empty, it seeds the database with a predefined list of products.
   * This function ensures that the product list is always available for the app.
   */
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

      // Seed database if it's empty, performing only one read operation.
      if (data.empty && initialProducts.length > 0) {
        console.log("Database is empty. Seeding with initial products...");
        const seededProducts: Product[] = [];
        // By using Promise.all, we can perform all write operations in parallel.
        const seedPromises = initialProducts.map(async (product) => {
          const { id, ...productData } = product; // Firestore will generate its own ID
          const docRef = await addDoc(productsCollectionRef, productData);
          // Construct the final product object in memory without needing another read.
          seededProducts.push({ ...productData, id: docRef.id });
        });
        await Promise.all(seedPromises);
        setProducts(seededProducts);
      } else {
        // Safely format each document to prevent errors from malformed data
        const fetchedProducts = data.docs.map(formatProduct);
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
      const error = new Error("Cannot add product, Firestore is not configured.");
      console.error(error);
      throw error;
    }
    try {
      const productsCollectionRef = collection(db, "products");
      const { image1, image2, image3, ...rest } = productData;
      const images = [image1, image2, image3].filter((img): img is string => !!img && img.trim() !== '');
      
      const newProductData = {
        ...rest,
        rating: 0,
        reviews: 0,
        image: image1,
        images: images,
        likeCount: 0,
      };

      const docRef = await addDoc(productsCollectionRef, newProductData);

      // Update state locally instead of refetching
      setProducts(prevProducts => [
        ...prevProducts,
        { ...newProductData, id: docRef.id } as Product
      ]);

    } catch (error) {
      console.error("Error adding product in context:", error);
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (productId: string, productData: Partial<ProductFormData>) => {
    if (!db) {
        const error = new Error("Cannot update product, Firestore is not configured.");
        console.error(error);
        throw error;
    }
    try {
      const productDoc = doc(db, "products", productId);
      
      const { image1, image2, image3, ...rest } = productData;
      
      const updatedData: Partial<Product> = { ...rest };

      if (image1) {
          const images = [image1, image2, image3].filter((img): img is string => !!img && img.trim() !== '');
          updatedData.image = image1;
          updatedData.images = images;
      }
      
      await updateDoc(productDoc, updatedData);

      // Update state locally instead of refetching
      setProducts(prevProducts =>
        prevProducts.map(p => 
          p.id === productId ? { ...p, ...updatedData } : p
        )
      );

    } catch (error) {
        console.error("Error updating product in context:", error);
        throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    if (!db) {
      const error = new Error("Cannot delete product, Firestore is not configured.");
      console.error(error);
      throw error;
    }
    try {
      const productDoc = doc(db, "products", productId);
      await deleteDoc(productDoc);
      
      // Update state locally instead of refetching
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      
    } catch (error) {
      console.error("Error deleting product in context:", error);
      throw error;
    }
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, setProducts, loading, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};
