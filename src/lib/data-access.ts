
'use server';

import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, type DocumentSnapshot } from "firebase/firestore";
import type { Product } from "@/lib/types";
import { products as initialProducts } from "@/lib/data";
import { formatProduct } from "@/lib/utils";

// This function is kept for potential future use or for server-only scenarios,
// but the main app will now rely on the ProductProvider context for consistency.
export async function getProductById(id: string): Promise<Product | null> {
    if (!db) {
        console.warn("Firestore is not initialized. Using local product data for getProductById.");
        const product = initialProducts.find(p => p.id === id) || null;
        return product;
    }

    try {
        const productDocRef = doc(db, "products", id);
        const docSnap = await getDoc(productDocRef);

        if (docSnap.exists()) {
            return formatProduct(docSnap);
        } else {
            console.warn(`Product with id ${id} not found in Firestore.`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching product with id ${id} from Firestore:`, error);
        return null;
    }
}

export async function getAllProducts(): Promise<Product[]> {
    if (!db) {
        console.warn("Firestore is not initialized. Using local product data for getAllProducts.");
        return initialProducts;
    }
    try {
      const productsCollectionRef = collection(db, "products");
      const data = await getDocs(productsCollectionRef);
      return data.docs.map(formatProduct);
    } catch (error) {
        console.error("Error fetching all products from Firestore:", error);
        return [];
    }
}
