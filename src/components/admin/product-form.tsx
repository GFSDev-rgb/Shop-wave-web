
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
  images: z.array(z.object({ value: z.string().url("Please enter a valid URL.") })).min(1, "At least one image is required.").max(10, "You can add a maximum of 10 images."),
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
      images: (product?.images?.length ? product.images : [product?.image || ""]).filter(Boolean).map(img => ({ value: img })),
    },
  });

  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control: form.control,
    name: "sizes",
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: "images",
  });


  const { isSubmitting } = form.formState;

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      const productDataToSave = {
        ...data,
        sizes: data.sizes?.map(s => s.value),
        images: data.images.map(i => i.value),
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
          {sizeFields.map((field, index) => (
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
                      <Button type="button" variant="outline" size="icon" onClick={() => removeSize(index)}>
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
            variant="secondary"
            size="sm"
            onClick={() => appendSize({ value: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Size
          </Button>
        </div>


        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">Images</h3>
            <p className="text-sm text-muted-foreground">{imageFields.length} / 10</p>
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {imageFields.map((field, index) => (
                <FormField
                    key={field.id}
                    control={form.control}
                    name={`images.${index}.value`}
                    render={({ field: formField }) => (
                    <FormItem>
                        <FormLabel className="text-xs text-muted-foreground">Image URL {index + 1}</FormLabel>
                        <div className="flex items-center gap-2">
                        <FormControl>
                            <Input placeholder="https://..." {...formField} />
                        </FormControl>
                        <Button type="button" variant="outline" size="icon" onClick={() => removeImage(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            ))}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => appendImage({ value: "" })}
            disabled={imageFields.length >= 10}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Image
          </Button>
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem>
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
