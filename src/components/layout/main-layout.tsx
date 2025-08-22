
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ReactNode } from 'react';
import { ScrollToTopButton } from '../scroll-to-top';

const noHeaderPaths = ['/login', '/signup', '/auth', '/welcome/start'];
const noFooterPaths = ['/login', '/signup', '/profile', '/admin', '/profile/edit', '/auth', '/welcome/start'];

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const showHeader = !noHeaderPaths.includes(pathname);
  
  const isProductPage = pathname.startsWith('/product/');
  const isOrderPage = pathname.startsWith('/order/');
  const showFooter = !noFooterPaths.includes(pathname) && !isProductPage && !isOrderPage;

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
