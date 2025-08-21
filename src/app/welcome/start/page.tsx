
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
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-card text-center">
        <div className="p-8 md:p-12">
            <div className="flex justify-center mb-6">
                <Logo />
            </div>
            <Sparkles className="h-12 w-12 mx-auto text-primary" />
            <CardTitle className="font-headline text-4xl md:text-5xl mt-4">Welcome to ShopWave!</CardTitle>
            <CardDescription className="mt-4 text-lg text-muted-foreground max-w-prose mx-auto">
                Create an account or sign in to unlock a personalized shopping experience, save your favorite items, and track your orders seamlessly.
            </CardDescription>
        </div>
        <div className="p-8 pt-0">
          <Button asChild size="lg" className="w-full max-w-xs mx-auto">
            <Link href="/auth">
              Get Started <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
    </div>
  );
}
