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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  }

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
    <>
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
            
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>

      <div id="menu" className={cn(isMenuOpen && "open", "z-50")}>
        <div className="shine"></div>
        <div className="shine shine-bottom"></div>
        <div className="glow glow-bright"></div>
        <div className="glow"></div>
        <div className="glow glow-bright glow-bottom"></div>
        <div className="glow glow-bottom"></div>

        <div className="inner">
            <label>
                <Search />
                <input type="search" placeholder="Search..." />
            </label>
            <section>
                <header>Navigation</header>
                <ul>
                    {navLinks.map((link) => (
                        <li key={link.href} className={cn(pathname === link.href && "selected")} onClick={() => setIsMenuOpen(false)}>
                            <Link href={link.href} className="flex items-center gap-2 w-full h-full">
                              <link.icon />
                              <span>{link.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
            <hr />
            <section>
                <header>Account</header>
                <ul>
                    {loading ? (
                        <li><Skeleton className="h-4 w-20 bg-gray-600" /></li>
                    ) : user ? (
                        <>
                           <li onClick={() => setIsMenuOpen(false)}>
                                <Link href="/wishlist" className="flex items-center gap-2 w-full h-full"><Heart /> Wishlist</Link>
                           </li>
                           <li onClick={() => setIsMenuOpen(false)}>
                                <Link href="/cart" className="flex items-center gap-2 w-full h-full"><ShoppingBag /> Cart</Link>
                           </li>
                           <li onClick={() => { signOut(); setIsMenuOpen(false); }}>
                                <span className="flex items-center gap-2 w-full h-full"><LogOut /> Logout</span>
                           </li>
                        </>
                    ) : (
                        <>
                           <li onClick={() => setIsMenuOpen(false)} className={cn(pathname === "/login" && "selected")}>
                                <Link href="/login" className="flex items-center gap-2 w-full h-full"><User /> Log In</Link>
                           </li>
                           <li onClick={() => setIsMenuOpen(false)} className={cn(pathname === "/signup" && "selected")}>
                                <Link href="/signup" className="flex items-center gap-2 w-full h-full"><User /> Sign Up</Link>
                           </li>
                        </>
                    )}
                </ul>
            </section>
        </div>
    </div>
    </>
  );
}
