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
  id:string;
  userId: string;
  createdAt: number; // Using number for JS Date timestamp
  items: OrderItem[];
  total: number;
};

export type UserProfile = {
  fullName: string;
  email: string;
  photoURL: string;
  phoneNumber: string;
  address: string;
  bio: string;
};
