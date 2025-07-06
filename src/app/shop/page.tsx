
"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import type { Metadata } from "next";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product-card";
import { Filters } from "./filters";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Filter, ArrowUpDown, PlusCircle } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useAuth } from "@/hooks/use-auth";
import ProductForm from "@/components/admin/product-form";
import { Skeleton } from "@/components/ui/skeleton";

// Note: Metadata cannot be exported from client components. 
// This would need to be a server component to have page-specific metadata.

const ITEMS_PER_PAGE = 12;

export default function ShopPage() {
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAddSheetOpen, setAddSheetOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const { products, loading: productsLoading } = useProducts();
  const { loading: authLoading, isAdmin } = useAuth();
  
  const isLoading = authLoading || productsLoading;

  const sortedAndFilteredProducts = useMemo(() => {
    let result = products
      .filter((product) => {
        const inCategory =
          selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const inPriceRange =
          product.price >= priceRange[0] && product.price <= priceRange[1];
        return inCategory && inPriceRange;
      });

    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        // Assuming products are already somewhat sorted by newness or just use default order
        break;
    }
    return result;
  }, [sortOption, priceRange, selectedCategories, products]);

  // Reset visible count when filters change
  useMemo(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [sortOption, priceRange, selectedCategories]);

  const renderedProducts = useMemo(() => {
    return sortedAndFilteredProducts.slice(0, visibleCount);
  }, [sortedAndFilteredProducts, visibleCount]);

  const observer = useRef<IntersectionObserver>();
  const lastProductElementRef = useCallback((node: HTMLElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleCount < sortedAndFilteredProducts.length) {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, visibleCount, sortedAndFilteredProducts.length]);


  const clearFilters = () => {
    setPriceRange([0, 500]);
    setSelectedCategories([]);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <header className="mb-12 text-center relative overflow-hidden rounded-lg p-8 bg-card/50 backdrop-blur-sm border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="relative">
          <h1 className="font-headline text-5xl font-bold">Our Collection</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our curated selection of high-quality products, crafted with passion and precision.
          </p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <main className="lg:col-span-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <span>Filters</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-background/80 backdrop-blur-sm border-r w-[320px] sm:w-[400px] flex flex-col p-0">
                            <SheetHeader className="p-6 pb-4 border-b">
                                <SheetTitle className="font-headline text-2xl">Filter Products</SheetTitle>
                                <SheetDescription>
                                    Refine your search by category and price.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="p-6 flex-1 overflow-y-auto">
                                <Filters
                                    priceRange={priceRange}
                                    setPriceRange={setPriceRange}
                                    selectedCategories={selectedCategories}
                                    setSelectedCategories={setSelectedCategories}
                                />
                            </div>
                            <div className="p-6 border-t">
                                <Button variant="ghost" className="w-full" onClick={clearFilters}>Clear all filters</Button>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {isAdmin && (
                        <Sheet open={isAddSheetOpen} onOpenChange={setAddSheetOpen}>
                            <SheetTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4"/>
                                    Add Product
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-background/80 backdrop-blur-sm border-l p-6 w-full max-w-md overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>Add a New Product</SheetTitle>
                                    <SheetDescription>Fill in the details below to add a new product to the store.</SheetDescription>
                                </SheetHeader>
                                <ProductForm onFinished={() => setAddSheetOpen(false)} />
                            </SheetContent>
                        </Sheet>
                    )}
                </div>
                
                <div className="flex items-center gap-4">
                    <p className="hidden sm:block text-sm text-muted-foreground">{sortedAndFilteredProducts.length} Products</p>
                    <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger className="w-[180px] bg-background">
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                            <SelectItem value="rating-desc">Top Rated</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-[400px] w-full rounded-lg" />
                        </div>
                    ))
                ) : renderedProducts.map((product, index) => {
                     const isLastElement = index === renderedProducts.length - 1;
                     return (
                        <ProductCard 
                            ref={isLastElement ? lastProductElementRef : null}
                            key={product.id} 
                            product={product} 
                        />
                     )
                })}
            </div>
            
            {/* Loading indicator for infinite scroll */}
            {!isLoading && visibleCount < sortedAndFilteredProducts.length && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
                     {Array.from({ length: 4 }).map((_, i) => (
                        <div key={`placeholder-${i}`} className="flex flex-col space-y-3">
                            <Skeleton className="h-[400px] w-full rounded-lg" />
                        </div>
                    ))}
                </div>
            )}
        </main>
      </div>
    </div>
  );
}
