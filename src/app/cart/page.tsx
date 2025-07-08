
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount, loading: cartLoading } = useCart();
  const router = useRouter();

  const isLoading = authLoading || cartLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex-1">
        <header className="text-center mb-12">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/4 mx-auto mt-4" />
        </header>
        <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
            <div className="lg:col-span-1">
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">Your Shopping Cart</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          You have {cartCount} item(s) in your cart.
        </p>
      </header>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-6 text-2xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
          <Button className="mt-6" onClick={() => router.push('/shop')}>
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(({ product, quantity }) => (
              <Card key={product.id} className="flex items-center p-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  data-ai-hint="product photo"
                  width={100}
                  height={120}
                  className="rounded-md object-cover aspect-[5/6]"
                />
                <div className="ml-6 flex-grow">
                  <Link href={`/product/${product.id}`} className="font-semibold text-lg hover:underline">
                    {product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <p className="text-lg font-bold text-primary mt-1">${product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-md">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity - 1)}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm">{quantity}</span>
                         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity + 1)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                  <Button variant="outline" size="icon" onClick={() => removeFromCart(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <aside className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild size="lg" className="w-full">
                    <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}
