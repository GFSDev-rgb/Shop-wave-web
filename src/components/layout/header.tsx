
"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, UserPlus, LogIn, LogOut, Home, Store, Users, Mail, Package, Settings, User } from "lucide-react";
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
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { CommandSearch } from "../search/command-search";

const allNavLinks = [
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

  const navLinks = allNavLinks;

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
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders" className="cursor-pointer flex items-center">
                <Package className="mr-2 h-4 w-4" />
                <span>My Orders</span>
              </Link>
            </DropdownMenuItem>
             <DropdownMenuItem disabled>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="cursor-pointer">
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
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1 md:gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-transparent border-none shadow-none p-0 w-auto h-auto max-w-none">
              <CommandSearch />
            </DialogContent>
          </Dialog>

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
              <SheetContent side="left" className="flex flex-col w-[300px] sm:w-[400px] bg-background/90 backdrop-blur-lg p-0 border-r border-white/10">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  {loading ? (
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ) : user ? (
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? user.email ?? 'User'} />
                        <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{user.displayName ?? user.email}</p>
                        <p className="text-xs text-muted-foreground">Welcome back</p>
                      </div>
                    </div>
                  ) : (
                    <Logo />
                  )}
                </div>

                {/* Main Nav */}
                <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-4 px-2.5 py-3 rounded-lg text-base font-medium",
                          pathname === link.href ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}

                  {user && (
                    <>
                      <Separator className="my-4 bg-white/10" />
                       <SheetClose asChild>
                        <Link
                          href="/profile"
                          className={cn(
                            "flex items-center gap-4 px-2.5 py-3 rounded-lg text-base font-medium",
                            pathname === '/profile' ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <User className="h-5 w-5" />
                          Profile
                        </Link>
                      </SheetClose>
                       <SheetClose asChild>
                        <Link
                          href="/orders"
                          className={cn(
                            "flex items-center gap-4 px-2.5 py-3 rounded-lg text-base font-medium",
                            pathname === '/orders' ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <Package className="h-5 w-5" />
                          My Orders
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/wishlist"
                          className={cn(
                            "flex items-center gap-4 px-2.5 py-3 rounded-lg text-base font-medium",
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
                            "flex items-center gap-4 px-2.5 py-3 rounded-lg text-base font-medium",
                            pathname === '/cart' ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <ShoppingBag className="h-5 w-5" />
                          Cart
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </nav>

                {/* Footer */}
                <div className="p-4 mt-auto border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      {loading ? (
                        <Skeleton className="h-10 w-24 rounded-lg" />
                      ) : user ? (
                        <SheetClose asChild>
                          <Button variant="outline" onClick={signOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                          </Button>
                        </SheetClose>
                      ) : (
                        <div className="flex gap-2">
                          <SheetClose asChild>
                            <Button asChild>
                              <Link href="/login">
                                <LogIn className="mr-2 h-4 w-4" />
                                Log In
                              </Link>
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button asChild variant="secondary">
                              <Link href="/signup">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Sign Up
                              </Link>
                            </Button>
                          </SheetClose>
                        </div>
                      )}
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
