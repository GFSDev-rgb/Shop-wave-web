
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ReactNode } from 'react';
import { ScrollToTopButton } from '../scroll-to-top';

const noHeaderPaths = ['/login', '/signup', '/auth', '/welcome/start', '/welcome/setup'];
const noFooterPaths = ['/login', '/signup', '/auth', '/welcome/start', '/welcome/setup', '/admin', '/profile/edit'];

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const showHeader = !noHeaderPaths.some(path => pathname.startsWith(path));
  
  const showFooter = !noFooterPaths.some(path => pathname.startsWith(path));

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
