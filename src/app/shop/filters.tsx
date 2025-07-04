"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = ["Apparel", "Accessories", "Footwear", "Home Goods", "Electronics", "Watches"];

interface FiltersProps {
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  className?: string;
}

export function Filters({ 
  priceRange, 
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  className,
}: FiltersProps) {
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 500]);
    setSelectedCategories([]);
  };

  return (
    <Card className={cn("bg-black/20 backdrop-blur-sm border border-white/10", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={clearFilters}>Clear all</Button>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["category", "price"]} className="w-full">
          <AccordionItem value="category" className="border-b border-white/10">
            <AccordionTrigger className="text-base font-semibold hover:no-underline">Category</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 mt-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-3">
                    <Checkbox 
                      id={category} 
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label htmlFor={category} className="font-normal text-sm cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="price" className="border-b-0">
            <AccordionTrigger className="text-base font-semibold hover:no-underline">Price Range</AccordionTrigger>
            <AccordionContent>
                <div className="mt-4">
                    <Slider
                        min={0}
                        max={500}
                        step={10}
                        value={priceRange}
                        onValueChange={(value: [number, number]) => setPriceRange(value)}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
