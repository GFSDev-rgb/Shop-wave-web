
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
  orderTime: Timestamp;
  orderStatus: 'Pending' | 'Delivered';
  customerInfo: {
    fullName: string;
    phoneNumber: string;
    address: string;
  };
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
