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
