"use client";

import { useState, useMemo } from "react";
import { products } from "@/lib/data";
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
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Filter, ArrowUpDown } from "lucide-react";

export default function ShopPage() {
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
  }, [sortOption, priceRange, selectedCategories]);

  const clearFilters = () => {
    setPriceRange([0, 500]);
    setSelectedCategories([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center relative overflow-hidden rounded-lg p-8 bg-black/20 backdrop-blur-sm border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="relative">
          <h1 className="font-headline text-5xl font-bold">Our Collection</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our curated selection of high-quality products, crafted with passion and precision.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <main>
          <div className="flex justify-between items-center mb-6 p-4 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10">
              <Sheet>
                  <SheetTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>Filters</span>
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="bg-background/80 backdrop-blur-sm border-r border-white/10">
                     <SheetHeader className="flex-row justify-between items-center border-b pb-4">
                        <SheetTitle>Filters</SheetTitle>
                        <Button variant="ghost" size="sm" onClick={clearFilters}>Clear all</Button>
                     </SheetHeader>
                     <div className="py-4">
                       <Filters 
                          priceRange={priceRange}
                          setPriceRange={setPriceRange}
                          selectedCategories={selectedCategories}
                          setSelectedCategories={setSelectedCategories}
                        />
                     </div>
                  </SheetContent>
              </Sheet>
              
              <div className="flex items-center gap-4">
                <p className="hidden sm:block text-sm text-muted-foreground">{sortedAndFilteredProducts.length} Products</p>
                <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[180px] bg-background border-white/20">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {sortedAndFilteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
