
import type { Timestamp } from "firebase/firestore";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  rating: number;
  reviews: number;
  likeCount: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type WishlistItem = {
  product: Product;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id?: string; // Optional because it's assigned by Firestore
  userId: string;
  orderTime: Timestamp;
  orderStatus: 'Pending' | 'Delivered';
  // Single product info
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
  // Customer info
  fullName: string;
  phoneNumber: string;
  city: string;
  village: string;
  fullAddress: string;
};

export type UserProfile = {
  fullName: string;
  email: string;
  photoURL: string;
  phoneNumber: string;
  address: string;
  bio: string;
  likes?: Record<string, boolean>;
  createdAt: Timestamp | ReturnType<typeof import("firebase/firestore").serverTimestamp>;
};
