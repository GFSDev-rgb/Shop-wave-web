"use client";

import { useContext } from "react";
import { ProductContext } from "@/context/product-context";

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
