
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import { useProducts } from '@/hooks/use-products';
import { Product } from '@/lib/types';
import { DialogClose } from '@/components/ui/dialog';
import './command-search.css';

export function CommandSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<Product[]>([]);
  const { products } = useProducts();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      setResults(filtered.slice(0, 5));
      setIsLoading(false);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, products]);

  return (
    <div className="search-container">
      <div className="bg"></div>
      <div className="input-wrapper">
        <div className="input">
          <div className="glow left"></div>
          <div className="glow right"></div>

          <input
            type="text"
            name="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />

          <div className="reflection"></div>

          <div className="icon">
            <svg
              stroke="#fff"
              viewBox="0 0 38 38"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              className="loading"
              style={{ opacity: isLoading ? 1 : 0 }}
            >
              <g fillRule="evenodd" fill="none">
                <g strokeWidth="3" transform="translate(1 1)">
                  <circle r="18" cy="18" cx="18" strokeOpacity=".2"></circle>
                  <path d="M36 18c0-9.94-8.06-18-18-18"></path>
                </g>
              </g>
            </svg>
            <svg
              viewBox="0 0 490.4 490.4"
              width="1em"
              height="1em"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="magnifier"
              style={{ opacity: isLoading ? 0 : 1 }}
            >
              <path
                d="M484.1,454.796l-110.5-110.6c29.8-36.3,47.6-82.8,47.6-133.4c0-116.3-94.3-210.6-210.6-210.6S0,94.496,0,210.796   s94.3,210.6,210.6,210.6c50.8,0,97.4-18,133.8-48l110.5,110.5c12.9,11.8,25,4.2,29.2,0C492.5,475.596,492.5,463.096,484.1,454.796z    M41.1,210.796c0-93.6,75.9-169.5,169.5-169.5s169.6,75.9,169.6,169.5s-75.9,169.5-169.5,169.5S41.1,304.396,41.1,210.796z"
              ></path>
            </svg>
          </div>

          <button className="filter">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
            </span>
          </button>

          <div className="result">
            <header className="result-header">
              <div style={{ '--i': 1 } as React.CSSProperties}>
                <input type="radio" id="all" name="tab" defaultChecked />
                <label htmlFor="all" data-label="Products">
                  <span>Products</span>
                </label>
              </div>
            </header>
            <div className="result-content-header">
              <div style={{ '--i': 1 } as React.CSSProperties}>Name <span>↓</span></div>
              <div style={{ '--i': 2 } as React.CSSProperties}>Category</div>
              <div style={{ '--i': 3 } as React.CSSProperties}>Price</div>
            </div>
            <div className="result-content">
              {results.length > 0 ? (
                results.map((product, index) => (
                  <DialogClose asChild key={product.id}>
                    <Link
                      href={`/product/${product.id}`}
                      style={{ '--i': index + 1 } as React.CSSProperties}
                    >
                      <div>{product.name}</div>
                      <div>{product.category}</div>
                      <div>${product.price.toFixed(2)}</div>
                    </Link>
                  </DialogClose>
                ))
              ) : (
                debouncedQuery && !isLoading && (
                  <div className="no-results-message">No products found.</div>
                )
              )}
              <div className="lava"></div>
            </div>
          </div>
        </div>
        <div className="glow-outline"></div>
        <div className="glow-layer-bg"></div>
        <div className="glow-layer-1"></div>
        <div className="glow-layer-2"></div>
        <div className="glow-layer-3"></div>
        <div className="glow left"></div>
        <div className="glow right"></div>
      </div>
    </div>
  );
}
