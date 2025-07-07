
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const categories = ["Apparel", "Accessories", "Footwear", "Home Goods", "Electronics", "Watches"];

interface FiltersProps {
  priceRange: [number, number];
  onPriceChange: (value: [number, number]) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

export function Filters({ 
  priceRange, 
  onPriceChange,
  selectedCategories,
  onCategoryToggle,
}: FiltersProps) {

  return (
    <Accordion type="multiple" defaultValue={["category", "price"]} className="w-full">
      <AccordionItem value="category" className="border-b border-border">
        <AccordionTrigger className="text-base font-semibold hover:no-underline">Category</AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-4 mt-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-3">
                <Checkbox 
                  id={`filter-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => onCategoryToggle(category)}
                />
                <Label htmlFor={`filter-${category}`} className="font-normal text-sm cursor-pointer">
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
                    onValueChange={onPriceChange}
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
