import { products } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductDetailsClient from "./product-details-client";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductPage({ params: { id } }: { params: { id: string } }) {
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Carousel className="w-full">
          <CarouselContent>
            {product.images.map((img, index) => (
              <CarouselItem key={index}>
                <Card className="overflow-hidden rounded-lg">
                  <CardContent className="p-0">
                    <Image
                      src={img}
                      alt={`${product.name} image ${index + 1}`}
                      data-ai-hint="product photo"
                      width={800}
                      height={1000}
                      className="w-full h-auto aspect-[4/5] object-cover"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <div className="prose text-foreground/80">
            <p>{product.description}</p>
          </div>
          <ProductDetailsClient product={product} />
        </div>
      </div>
    </div>
  );
}
