
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useProducts } from "@/hooks/use-products";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Please select a category"),
  sizes: z.array(z.object({ value: z.string().min(1, "Size cannot be empty.") })).optional(),
  image1: z.string().url("Please enter a valid URL for the main image."),
  image2: z.string().url("Please enter a valid URL or leave empty.").optional().or(z.literal('')),
  image3: z.string().url("Please enter a valid URL or leave empty.").optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onFinished?: () => void;
}

const categories = ["Apparel", "Accessories", "Footwear", "Home Goods", "Electronics", "Watches"];

export default function ProductForm({ product, onFinished }: ProductFormProps) {
  const { toast } = useToast();
  const { addProduct, updateProduct } = useProducts();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      category: product?.category || "",
      sizes: product?.sizes?.map(size => ({ value: size })) || [],
      image1: product?.images?.[0] || product?.image || "",
      image2: product?.images?.[1] || "",
      image3: product?.images?.[2] || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sizes",
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      const productDataToSave = {
        ...data,
        sizes: data.sizes?.map(s => s.value)
      }

      if (product) {
        await updateProduct(product.id, productDataToSave);
      } else {
        await addProduct(productDataToSave);
      }
      toast({
        title: product ? "Product Updated" : "Product Added",
        description: `"${data.name}" has been saved successfully.`,
      });
      onFinished?.();
      if (!product) form.reset();
    } catch (error: any) {
      console.error("Failed to save product:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message || "Could not save product. Please check console for errors.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 p-1 mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Product Details</h3>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Minimalist Watch" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the product..." {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Pricing & Category</h3>
          <div className="grid grid-cols-2 gap-4">
              <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g. 199.99" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
              <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                              <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                          </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                  )}
              />
          </div>
        </div>

        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Sizing</h3>
          {fields.map((field, index) => (
             <FormField
                key={field.id}
                control={form.control}
                name={`sizes.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Size {index + 1}</FormLabel>
                    <div className="flex items-center gap-2">
                       <FormControl>
                        <Input placeholder={`e.g. Medium or 42`} {...field} />
                      </FormControl>
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ value: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Size
          </Button>
        </div>


        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Images</h3>
          <FormField
            control={form.control}
            name="image1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Image URL 2</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image2.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Image URL 3</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image3.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full !mt-10" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? "Save Changes" : "Add Product"}
        </Button>
      </form>
    </Form>
  );
}
