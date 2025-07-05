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
    <div className="relative flex min-h-dvh flex-col">
      {showHeaderFooter && <Header />}
      <main className="flex flex-1 flex-col">{children}</main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}
