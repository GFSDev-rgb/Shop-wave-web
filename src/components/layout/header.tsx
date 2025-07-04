
"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, User, LogOut, Home, Store, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "../theme-toggle";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/about", label: "About Us", icon: Users },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, signOut, loading } = useAuth();

  const renderUserAuth = () => {
    if (loading) {
      return (
        <>
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-24" />
        </>
      );
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? user.email ?? 'User'} />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Profile</DropdownMenuItem>
            <DropdownMenuItem disabled>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <>
        <Button asChild variant="ghost">
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Logo />
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-sm font-medium text-foreground/80 transition-all hover:text-foreground hover:scale-105"
            >
              <link.icon className="h-4 w-4 transition-transform group-hover:rotate-[-5deg]" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <div className="hidden md:flex items-center gap-2">
            {renderUserAuth()}
          </div>
          
          <ThemeToggle />

          <Button variant="ghost" size="icon" asChild>
            <Link href="/wishlist" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {wishlistCount}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex h-full flex-col p-6">
                <div className="mb-8">
                  <Logo />
                </div>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-4 rounded-lg p-3 text-lg font-medium hover:bg-muted"
                    >
                      <link.icon className="h-5 w-5 text-muted-foreground" />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-2">
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : user ? (
                    <Button onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </Button>
                  ) : (
                    <>
                      <Button asChild><Link href="/login">Log In</Link></Button>
                      <Button asChild variant="secondary"><Link href="/signup">Sign Up</Link></Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
