"use server";

import { productRecommendations } from "@/ai/flows/product-recommendation";
import type { Product } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

async function getAllProducts(): Promise<Product[]> {
    const productsCollectionRef = collection(db, "products");
    const data = await getDocs(productsCollectionRef);
    return data.docs.map(doc => ({ ...(doc.data() as Omit<Product, 'id'>), id: doc.id }));
}

export async function getRecommendationsAction(): Promise<Product[]> {
  try {
    const allProducts = await getAllProducts();
    const userHistory = "viewed: Artisan Leather Messenger Bag, wishlist: Cloud-Soft Cashmere Sweater";
    const productCatalog = allProducts.map((p) => p.name).join(", ");
    
    const { recommendedProducts } = await productRecommendations({
      userHistory,
      productCatalog,
    });
    
    const fullProductDetails = recommendedProducts
      .map((name) => allProducts.find((p) => p.name === name))
      .filter((p): p is Product => p !== undefined);
      
    return fullProductDetails;
  } catch (error) {
    console.error("Failed to get AI recommendations:", error);
    return [];
  }
}
