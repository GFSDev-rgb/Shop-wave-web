'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ReactNode } from 'react';

const noHeaderFooterPaths = ['/login', '/signup'];

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showHeaderFooter = !noHeaderFooterPaths.includes(pathname);

  return (
    <div id="app" className="relative flex min-h-dvh flex-col">
      {showHeaderFooter && <Header />}
      <main className="flex-1">{children}</main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}
