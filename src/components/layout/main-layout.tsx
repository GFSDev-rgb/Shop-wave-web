'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ReactNode } from 'react';
import { ScrollToTopButton } from '../scroll-to-top';
import { AnimatePresence, motion } from 'framer-motion';

const noHeaderPaths = ['/login', '/signup'];
const noFooterPaths = ['/login', '/signup', '/profile', '/shop'];

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showHeader = !noHeaderPaths.includes(pathname);
  
  const isProductPage = pathname.startsWith('/product/');
  const showFooter = !noFooterPaths.includes(pathname) && !isProductPage;

  return (
    <div className="relative flex min-h-dvh flex-col">
      {showHeader && <Header />}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-1 flex-col"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {showFooter && <Footer />}
      <ScrollToTopButton />
    </div>
  );
}
