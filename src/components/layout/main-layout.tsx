'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ReactNode, useState, useEffect, useRef } from 'react';
import { ScrollToTopButton } from '../scroll-to-top';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Loader from '@/components/capybara-loader';

const noHeaderPaths = ['/login', '/signup'];
const noFooterPaths = ['/login', '/signup', '/profile', '/shop'];

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // Animation duration
        prevPathname.current = pathname;
        return () => clearTimeout(timer);
    }
  }, [pathname]);

  const showHeader = !noHeaderPaths.includes(pathname);
  
  const isProductPage = pathname.startsWith('/product/');
  const isOrderPage = pathname.startsWith('/order/');
  const showFooter = !noFooterPaths.includes(pathname) && !isProductPage && !isOrderPage;

  const showLoader = isLoading && resolvedTheme === 'light';

  return (
    <div className="relative flex min-h-dvh flex-col">
      {showLoader && <Loader />}
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
