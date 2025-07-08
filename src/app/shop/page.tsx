
"use client";

import { useState, useMemo, useRef, useCallback, useEffect, useTransition } from "react";
import { useDebounce } from "use-debounce";
import dynamic from "next/dynamic";
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
import { Input } from "@/components/ui/input";
import { Filter, ArrowUpDown, PlusCircle, Loader2, Search } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Note: Metadata cannot be exported from client components. 
// This would need to be a server component to have page-specific metadata.

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

  // Debounce filter values to prevent excessive re-renders while user is interacting with controls
  const [debouncedPriceRange] = useDebounce(priceRange, 300);
  const [debouncedSelectedCategories] = useDebounce(selectedCategories, 300);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const { products, loading: productsLoading } = useProducts();
  const { loading: authLoading, isAdmin } = useAuth();
  
  const workerRef = useRef<Worker>();
  const [sortedAndFilteredProducts, setSortedAndFilteredProducts] = useState<Product[]>([]);
  
  const isLoading = authLoading || productsLoading;
  const isFiltering = isPending;

  // Effect to initialize the Web Worker
  useEffect(() => {
    // Ensure this runs only on the client where window.Worker is available
    if (typeof window !== 'undefined' && window.Worker) {
      workerRef.current = new Worker(new URL('../../workers/product-filter.worker.ts', import.meta.url));
      
      // Listen for messages from the worker
      workerRef.current.onmessage = (event: MessageEvent<Product[]>) => {
        setSortedAndFilteredProducts(event.data);
      };

      // Cleanup on component unmount
      return () => {
        workerRef.current?.terminate();
      };
    }
  }, []);

  // Effect to process filtering and sorting
  useEffect(() => {
    // Wait until products have been loaded
    if (productsLoading) {
      // While loading, keep the list empty to allow skeletons to show
      setSortedAndFilteredProducts([]);
      return;
    }

    // Use the Web Worker if it's available
    if (workerRef.current) {
      workerRef.current.postMessage({
        products,
        priceRange: debouncedPriceRange,
        selectedCategories: debouncedSelectedCategories,
        sortOption,
        searchQuery: debouncedSearchQuery,
      });
    } else {
      // Fallback for browsers without Web Worker support or before worker is initialized
      let result = products
        .filter((product) => {
          const inSearch = debouncedSearchQuery === '' || product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
          const inCategory =
            debouncedSelectedCategories.length === 0 || debouncedSelectedCategories.includes(product.category);
          const inPriceRange =
            product.price >= debouncedPriceRange[0] && product.price <= debouncedPriceRange[1];
          return inSearch && inCategory && inPriceRange;
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
          break;
      }
      setSortedAndFilteredProducts(result);
    }
  }, [sortOption, debouncedPriceRange, debouncedSelectedCategories, debouncedSearchQuery, products, productsLoading]);


  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [sortOption, debouncedPriceRange, debouncedSelectedCategories, debouncedSearchQuery]);

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

  const handleSortChange = (value: string) => {
    startTransition(() => {
      setSortOption(value);
    });
  };

  const handlePriceChange = (value: [number, number]) => {
    startTransition(() => {
      setPriceRange(value);
    });
  };

  const handleCategoryToggle = (category: string) => {
    startTransition(() => {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );
    });
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setSearchQuery(event.target.value);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      setPriceRange([0, 500]);
      setSelectedCategories([]);
      setSearchQuery("");
    });
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <header className="mb-12 text-center relative overflow-hidden rounded-lg p-4 md:p-8 bg-card/50 backdrop-blur-sm border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="relative">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Collection</h1>
          <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our curated selection of high-quality products, crafted with passion and precision.
          </p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
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
                        className="pl-9 bg-background w-full"
                    />
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto sm:justify-end">
                    <p className="hidden sm:block text-sm text-muted-foreground">{sortedAndFilteredProducts.length} Products</p>
                    {isFiltering && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                    <Select value={sortOption} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-background">
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
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 transition-opacity duration-300",
                isFiltering && "opacity-70"
            )}>
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

            {!isLoading && renderedProducts.length === 0 && (
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
            {!isLoading && visibleCount < sortedAndFilteredProducts.length && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8">
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
