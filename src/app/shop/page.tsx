
"use client";

import { useState, useMemo, useRef, useCallback, useEffect, useTransition } from "react";
import Link from 'next/link';
import { useDebounce } from "use-debounce";
import dynamic from "next/dynamic";
import type { Product } from "@/lib/types";
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
import { Input } from "@/components/ui/input";
import { Filter, ArrowUpDown, PlusCircle, Loader2, Search, User } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const ProductForm = dynamic(() => import('@/components/admin/product-form'), {
  loading: () => (
    <div className="space-y-8 p-1 mt-6">
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-5 w-32 mt-4" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full mt-2" />
          </div>
          <div>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full mt-2" />
          </div>
        </div>
      </div>
    </div>
  ),
});

const ITEMS_PER_PAGE = 8;

export default function ShopPage() {
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSheetOpen, setAddSheetOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isPending, startTransition] = useTransition();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const workerRef = useRef<Worker>();

  const { products, loading: productsLoading } = useProducts();
  const { user, loading: authLoading, isAdmin } = useAuth();
  
  const isLoading = authLoading || productsLoading;
  const isFiltering = isPending;

  useEffect(() => {
    workerRef.current = new Worker(new URL('../../workers/product-filter.worker.ts', import.meta.url));
    workerRef.current.onmessage = (event: MessageEvent<Product[]>) => {
        setFilteredProducts(event.data);
    };
    return () => {
        workerRef.current?.terminate();
    }
  }, []);

  const [debouncedPriceRange] = useDebounce(priceRange, 300);
  const [debouncedSelectedCategories] = useDebounce(selectedCategories, 300);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [debouncedSortOption] = useDebounce(sortOption, 300);

  useEffect(() => {
    if (products.length > 0 && workerRef.current) {
      startTransition(() => {
        workerRef.current?.postMessage({
            products,
            priceRange: debouncedPriceRange,
            selectedCategories: debouncedSelectedCategories,
            sortOption: debouncedSortOption,
            searchQuery: debouncedSearchQuery
        });
      });
    } else if (!productsLoading) {
        setFilteredProducts(products);
    }
  }, [products, productsLoading, debouncedPriceRange, debouncedSelectedCategories, debouncedSortOption, debouncedSearchQuery]);
  

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [debouncedPriceRange, debouncedSelectedCategories, debouncedSearchQuery, debouncedSortOption]);


  const renderedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const observer = useRef<IntersectionObserver>();
  const lastProductElementRef = useCallback((node: HTMLElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, visibleCount, filteredProducts.length]);

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const clearFilters = () => {
    startTransition(() => {
      setPriceRange([0, 500]);
      setSelectedCategories([]);
      setSearchQuery("");
      setSortOption("newest");
    });
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:col-span-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                </div>
            ))}
        </div>
      )
    }
    
    return (
        <main className="lg:col-span-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 w-full sm:w-auto">
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
                                    onPriceChange={handlePriceChange}
                                    selectedCategories={selectedCategories}
                                    onCategoryToggle={handleCategoryToggle}
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

                <div className="relative w-full sm:flex-1 sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-9 bg-secondary w-full"
                    />
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto sm:justify-end">
                    <p className="hidden sm:block text-sm text-muted-foreground">{filteredProducts.length} Products</p>
                    {isFiltering && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                    <Select value={sortOption} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-secondary">
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

            <div className={cn(
                "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 transition-opacity duration-300",
                isFiltering && "opacity-70"
            )}>
                 {renderedProducts.map((product, index) => {
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

            {renderedProducts.length === 0 && !isLoading && (
                <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
                    <Search className="mx-auto h-16 w-16 text-muted-foreground" />
                    <h2 className="mt-6 text-2xl font-semibold">No Products Found</h2>
                    <p className="mt-2 text-muted-foreground">Try adjusting your search or filters.</p>
                    <Button className="mt-6" variant="outline" onClick={clearFilters}>
                        Clear Filters
                    </Button>
                </div>
            )}
            
            {/* Loading indicator for infinite scroll */}
            {visibleCount < filteredProducts.length && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8">
                     {Array.from({ length: 4 }).map((_, i) => (
                        <div key={`placeholder-${i}`} className="flex flex-col space-y-3">
                            <Skeleton className="h-[400px] w-full rounded-lg" />
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <header className="mb-12 text-center p-4 md:p-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Collection</h1>
        <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our curated selection of high-quality products, crafted with passion and precision.
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {renderContent()}
      </div>
    </div>
  );
}

    