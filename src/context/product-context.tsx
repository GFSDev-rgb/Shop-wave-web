
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
  images: string[];
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

// Cache products in memory to avoid repeated Firestore reads
let productCache: Product[] | null = null;

/**
 * Provides product data to the application.
 * It fetches products from Firestore and handles CRUD operations.
 * If Firestore is empty, it will automatically seed the database with initial data.
 */
export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(productCache || []);
  const [loading, setLoading] = useState(!productCache);

  /**
   * Fetches all products from the 'products' collection in Firestore.
   * If the collection is empty, it seeds the database with a predefined list of products.
   * This function ensures that the product list is always available for the app.
   */
  const fetchProducts = useCallback(async () => {
    if (productCache) {
      setProducts(productCache);
      setLoading(false);
      return;
    }
    
    setLoading(true);

    if (!db) {
        console.warn("Firestore is not initialized. Using local product data.");
        productCache = initialProducts;
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
        productCache = seededProducts;
      } else {
        // Safely format each document to prevent errors from malformed data
        const fetchedProducts = data.docs.map(formatProduct);
        setProducts(fetchedProducts);
        productCache = fetchedProducts;
      }
    } catch (error) {
      console.error("Error fetching products from Firestore:", error);
      // Fallback to local data on error
      setProducts(initialProducts);
      productCache = initialProducts;
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
      
      const newProductData = {
        ...productData,
        rating: 0,
        reviews: 0,
        image: productData.images[0], // Use the first image as the primary one
        likeCount: 0,
      };

      const docRef = await addDoc(productsCollectionRef, newProductData);
      
      const newProductEntry = { ...newProductData, id: docRef.id } as Product;

      // Update state and cache locally
      setProducts(prevProducts => [...prevProducts, newProductEntry]);
      productCache = [...(productCache || []), newProductEntry];

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

        const dataToUpdate: Partial<Product> = { ...productData };

        if (productData.images && productData.images.length > 0) {
            dataToUpdate.image = productData.images[0];
        }

        await updateDoc(productDoc, dataToUpdate);

        const updatedProducts = (productCache || []).map(p =>
            p.id === productId ? { ...p, ...dataToUpdate } : p
        );
        setProducts(updatedProducts);
        productCache = updatedProducts;

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
      
      // Update state and cache locally
      const updatedProducts = (productCache || []).filter(p => p.id !== productId);
      setProducts(updatedProducts);
      productCache = updatedProducts;
      
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
