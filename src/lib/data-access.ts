'use server';

import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, type DocumentSnapshot } from "firebase/firestore";
import type { Product } from "@/lib/types";
import { products as initialProducts } from "@/lib/data";

/**
 * Safely formats a Firestore document into a Product object,
 * providing default values for any missing fields to ensure data integrity.
 * @param doc The Firestore document snapshot.
 * @returns A well-formed Product object.
 */
export function formatProduct(doc: DocumentSnapshot): Product {
    const data = doc.data() || {};
    return {
        id: doc.id,
        name: data.name || 'Untitled Product',
        description: data.description || '',
        price: data.price || 0,
        image: data.image || 'https://placehold.co/600x400.png',
        images: data.images && Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.image || 'https://placehold.co/600x400.png'],
        category: data.category || 'Uncategorized',
        rating: data.rating || 0,
        reviews: data.reviews || 0,
        likeCount: data.likeCount || 0,
    };
}

export async function getProductById(id: string): Promise<Product | null> {
    if (!db) {
        console.warn("Firestore is not initialized. Using local product data for getProductById.");
        const product = initialProducts.find(p => p.id === id) || null;
        // The local data has an 'id' field, but firestore docs don't until we add it.
        // This function's return type assumes 'id' is present.
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
        return null; // Fallback or re-throw as needed
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
