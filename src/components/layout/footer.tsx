import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Logo } from "@/components/logo";
import { NewsletterForm } from "./newsletter-form";

export function Footer() {
  return (
    <footer className="bg-black/20 backdrop-blur-sm text-muted-foreground border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo className="text-foreground"/>
            <p className="mt-4 text-sm">The new wave of online shopping, delivering quality and style to your doorstep.</p>
            <div className="flex mt-4 space-x-4">
              <Link href="#" className="hover:text-foreground">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/shop" className="hover:text-foreground">All Products</Link></li>
              <li><Link href="#" className="hover:text-foreground">Apparel</Link></li>
              <li><Link href="#" className="hover:text-foreground">Accessories</Link></li>
              <li><Link href="#" className="hover:text-foreground">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-foreground">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-foreground">FAQ</Link></li>
              <li><Link href="#" className="hover:text-foreground">Shipping & Returns</Link></li>
              <li><Link href="#" className="hover:text-foreground">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground">Newsletter</h3>
            <p className="mt-4 text-sm">Subscribe for the latest trends and offers.</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ShopWave. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
