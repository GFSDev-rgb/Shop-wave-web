'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ReactNode } from 'react';
import { ScrollToTopButton } from '../scroll-to-top';

const noHeaderPaths = ['/login', '/signup'];
const noFooterPaths = ['/login', '/signup', '/profile'];

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showHeader = !noHeaderPaths.includes(pathname);
  const showFooter = !noFooterPaths.includes(pathname);

  return (
    <div className="relative flex min-h-dvh flex-col">
      {showHeader && <Header />}
      <main className="flex flex-1 flex-col">{children}</main>
      {showFooter && <Footer />}
      <ScrollToTopButton />
    </div>
  );
}
