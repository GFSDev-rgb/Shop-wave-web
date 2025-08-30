
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { Logo } from '@/components/logo';

export const metadata: Metadata = {
    title: 'Welcome to ShopWave',
    description: 'Join the ShopWave community to start your personalized shopping journey.',
};

export default function WelcomeStartPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center p-8 md:p-16 lg:p-24 bg-card">
        <div className="max-w-xl">
            <div className="mb-6">
                <Logo />
            </div>
            <Sparkles className="h-12 w-12 text-primary" />
            <CardTitle className="font-headline text-4xl md:text-5xl mt-4">Welcome to ShopWave!</CardTitle>
            <CardDescription className="mt-4 text-lg text-muted-foreground">
                Create an account or sign in to unlock a personalized shopping experience, save your favorite items, and track your orders seamlessly.
            </CardDescription>
            <div className="mt-8">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/auth">
                  Get Started <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
        </div>
    </div>
  );
}

    