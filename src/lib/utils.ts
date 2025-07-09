import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { DocumentSnapshot } from "firebase/firestore";
import type { Product } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
