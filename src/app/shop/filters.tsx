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
import { useState } from "react";

const categories = ["Apparel", "Accessories", "Footwear", "Home Goods", "Electronics"];

export function Filters() {
  const [priceRange, setPriceRange] = useState([0, 500]);

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["category", "price"]} className="w-full">
          <AccordionItem value="category">
            <AccordionTrigger className="text-base font-semibold">Category</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 mt-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox id={category} />
                    <Label htmlFor={category} className="font-normal text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="price">
            <AccordionTrigger className="text-base font-semibold">Price Range</AccordionTrigger>
            <AccordionContent>
                <div className="mt-4">
                    <Slider
                        defaultValue={[0, 500]}
                        max={500}
                        step={10}
                        onValueChange={setPriceRange}
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
