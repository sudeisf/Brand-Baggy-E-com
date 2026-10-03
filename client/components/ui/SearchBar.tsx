"use client"

import api from "@/lib/axios";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ProductSearchResult {
  id: number;
  name: string;
  description: string;
  main_image: string | null;
  price: number;
}

interface PaginatedSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductSearchResult[];
}

interface SearchBarProps {
  className?: string;
  onSelectProduct?: () => void;
}

export default function SearchBar({ className, onSelectProduct }: SearchBarProps) {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsOpen(true);

    const timer = setTimeout(async () => {
      try {
        const response = await api.get<PaginatedSearchResponse>('/product/search-product/', {
          params: { search: trimmed }
        });
        setResults(response.data.results || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  const handleProductClick = (productId: number) => {
    setIsOpen(false);
    onSelectProduct?.();
    router.push(`/products/${productId}`);
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-white items-center justify-start gap-2 rounded-sm px-3 py-1.5 border ${
        className ?? "hidden sm:flex w-[10rem] md:w-[15rem] lg:w-[20rem]"
      }`}
    >
      <Search className="text-[#331d67] w-4 h-4 md:w-5 md:h-5 shrink-0" />
      <input 
        type="text" 
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        onFocus={() => {
          if (results.length > 0 || isLoading) setIsOpen(true);
        }}
        placeholder="Search..." 
        className="rounded-md outline-none bg-white w-full text-sm md:text-base text-[#331d67]" 
      />

      {isOpen && isLoading && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md py-2 px-4 text-sm z-50 text-gray-500 rounded-b-md">
          Searching...
        </div>
      )}
      
      {isOpen && !isLoading && error && (
        <div className="absolute top-full left-0 right-0 bg-red-50 text-red-600 shadow-md py-2 px-4 text-sm z-50 rounded-b-md">
          {error}
        </div>
      )}
      
      {isOpen && !isLoading && !error && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md z-50 max-h-80 overflow-y-auto rounded-b-md border-t">
          {results.map((product: ProductSearchResult) => (
            <div 
              key={product.id} 
              className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b last:border-b-0"
              onClick={() => handleProductClick(product.id)}
            >
              {product.main_image && (
                <img 
                  src={product.main_image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded" 
                />
              )}
              <div>
                <h3 className="font-medium text-sm text-[#331d67]">{product.name}</h3>
                <p className="text-gray-600 text-xs">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && !isLoading && !error && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md py-3 px-4 text-sm text-gray-500 z-50 rounded-b-md">
          No products found for "{query.trim()}"
        </div>
      )}
    </div>
  );
}