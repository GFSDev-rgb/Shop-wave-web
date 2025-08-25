
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ReactNode } from 'react';
import { ScrollToTopButton } from '../scroll-to-top';

const noHeaderPaths = ['/login', '/signup', '/auth', '/welcome/start', '/welcome/setup'];
const noFooterPaths = ['/login', '/signup', '/profile', '/admin', '/profile/edit', '/auth', '/welcome/start', '/welcome/setup'];

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const showHeader = !noHeaderPaths.some(path => pathname.startsWith(path));
  
  const isExcluded = noFooterPaths.some(path => pathname.startsWith(path)) || 
                   pathname.startsWith('/product/') ||
                   pathname.startsWith('/order/');

  const showFooter = !isExcluded;

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <div className="relative z-10 flex flex-1 flex-col">
        {showHeader && <Header />}
        <main className="flex flex-1 flex-col">
            {children}
        </main>
        {showFooter && <Footer />}
      </div>

      <ScrollToTopButton />
    </div>
  );
}
