"use server";

import { productRecommendations } from "@/ai/flows/product-recommendation";
import { products as allProducts } from "@/lib/data";
import type { Product } from "@/lib/types";

export async function getRecommendationsAction(): Promise<Product[]> {
  try {
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
