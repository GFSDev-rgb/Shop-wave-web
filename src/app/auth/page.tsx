
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, UserPlus, LogIn } from 'lucide-react';
import type { Metadata } from 'next';
import { Logo } from '@/components/logo';

export const metadata: Metadata = {
    title: 'Get Started',
    description: 'Join ShopWave or sign in to your account.',
};

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center p-8 md:p-16 lg:p-24 bg-card">
      <div className="mx-auto w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full overflow-hidden rounded-lg bg-background shadow-lg">
          {/* Sign Up Section */}
          <div className="p-8 md:p-12 bg-background/50">
              <CardHeader className="p-0 text-center md:text-left">
              <UserPlus className="h-10 w-10 mb-4 text-primary mx-auto md:mx-0" />
              <CardTitle className="font-headline text-3xl">New to ShopWave?</CardTitle>
              <CardDescription className="mt-2">
                  Create an account to enjoy a personalized shopping experience, save your favorites, and track your orders.
              </CardDescription>
              </CardHeader>
              <CardContent className="p-0 mt-8">
              <Button asChild size="lg" className="w-full">
                  <Link href="/signup">
                  Sign Up for Free <ArrowRight className="ml-2" />
                  </Link>
              </Button>
              </CardContent>
          </div>
          
          {/* Separator for mobile */}
          <div className="md:hidden">
              <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                  <Separator />
              </div>
              <div className="relative flex justify-center">
                  <span className="bg-background px-2 text-sm text-muted-foreground">OR</span>
              </div>
              </div>
          </div>
          
          {/* Sign In Section */}
          <div className="p-8 md:p-12 bg-secondary/30">
              <CardHeader className="p-0 text-center md:text-left">
              <LogIn className="h-10 w-10 mb-4 text-primary mx-auto md:mx-0" />
              <CardTitle className="font-headline text-3xl">Already have an account?</CardTitle>
              <CardDescription className="mt-2">
                  Welcome back! Sign in to access your profile, cart, and wishlist.
              </CardDescription>
              </CardHeader>
              <CardContent className="p-0 mt-8">
              <Button asChild size="lg" variant="secondary" className="w-full">
                  <Link href="/login">
                  Log In <ArrowRight className="ml-2" />
                  </Link>
              </Button>
              </CardContent>
          </div>
        </div>
        <div className="mt-8 text-center">
            <Button variant="link" asChild>
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
