
'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from '@studio-freight/react-lenis';
import { ArrowUp } from 'lucide-react';
import { throttle } from 'lodash';
import { Button } from '@/components/ui/button';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const throttledToggleVisibility = throttle(toggleVisibility, 200);

    window.addEventListener('scroll', throttledToggleVisibility);

    return () => {
        window.removeEventListener('scroll', throttledToggleVisibility);
        throttledToggleVisibility.cancel();
    }
  }, []);

  const scrollToTop = () => {
    // Prioritize lenis for smooth scrolling, but fall back to native scroll for robustness.
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            size="icon"
            onClick={scrollToTop}
            className="rounded-full h-12 w-12 shadow-lg"
            asChild
          >
            <motion.button
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
            >
                <ArrowUp className="h-6 w-6" />
                <span className="sr-only">Go to top</span>
            </motion.button>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
