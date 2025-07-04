"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, User, LogOut, Home, Store, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "../theme-toggle";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderUserAuth = () => {
    if (loading) {
      return (
        <Skeleton className="h-10 w-10 rounded-full" />
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/10 backdrop-blur supports-[backdrop-filter]:bg-background/10">
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

          <Button variant="ghost" size="icon" asChild>
            <Link href="/wishlist" className="relative">
              <Heart className="h-5 w-5" />
              {isClient && wishlistCount > 0 && (
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
              {isClient && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
          
          <ThemeToggle />

          <div className="hidden md:flex items-center gap-2">
            {renderUserAuth()}
          </div>
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background/80 backdrop-blur-sm border-r-white/10 p-6">
                <Logo />
                <nav className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                            "flex items-center gap-4 px-2.5 py-2 rounded-lg text-lg",
                            pathname === link.href ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <Separator className="my-4"/>
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : user ? (
                     <>
                      <SheetClose asChild>
                        <Link
                          href="/wishlist"
                          className={cn(
                              "flex items-center gap-4 px-2.5 py-2 rounded-lg text-lg",
                              pathname === '/wishlist' ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <Heart className="h-5 w-5" />
                          Wishlist
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/cart"
                          className={cn(
                              "flex items-center gap-4 px-2.5 py-2 rounded-lg text-lg",
                              pathname === '/cart' ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <ShoppingBag className="h-5 w-5" />
                          Cart
                        </Link>
                       </SheetClose>
                       <SheetClose asChild>
                        <Button variant="outline" onClick={signOut} className="w-full justify-start gap-4 px-2.5 py-2 text-lg h-auto">
                          <LogOut className="h-5 w-5" />
                          Logout
                        </Button>
                       </SheetClose>
                     </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link
                          href="/login"
                          className={cn(
                              "flex items-center gap-4 px-2.5 py-2 rounded-lg text-lg",
                              pathname === '/login' ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <User className="h-5 w-5" />
                          Log In
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/signup"
                          className={cn(
                              "flex items-center gap-4 px-2.5 py-2 rounded-lg text-lg",
                              pathname === '/signup' ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <User className="h-5 w-5" />
                          Sign Up
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
