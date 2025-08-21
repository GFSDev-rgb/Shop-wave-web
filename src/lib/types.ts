
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
  id: string;
  userId: string;
  createdAt: Timestamp;
  items: OrderItem[];
  total: number;
  // New fields from the order form
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  deliveryMethod: 'Cash on Delivery';
  fullName: string;
  phoneNumber: string;
  city: string;
  village: string;
  fullAddress: string;
  orderTime: Timestamp;
  orderStatus: 'Pending' | 'Delivered';
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
