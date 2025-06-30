"use client"

import api from "@/lib/axios";
import { Search } from "lucide-react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

type ApiError = {
  message: string;
  [key: string]: any;
};

export default function SearchBar() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timer: NodeJS.Timeout;
    const debounced = (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
    debounced.cancel = () => clearTimeout(timer);
    return debounced;
  };

  const searchProducts = async (searchQuery: string): Promise<void> => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get<PaginatedSearchResponse>('/product/search-product/', {
        params: { search: searchQuery } 
      });
      setResults(response.data.results);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce(searchProducts, 300);

  useEffect(() => {
    debouncedSearch(query);
    // Cleanup function to cancel debounce on unmount
    return () => {
      debouncedSearch.cancel?.();
    };
  }, [query]);

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="relative hidden sm:flex w-[10rem] md:w-[20rem] lg:w-[30rem] bg-white items-center justify-start gap-2 rounded-sm px-3 py-1.5 border-1">
      <Search className="text-black w-4 h-4 md:w-5 md:h-5" />
      <input 
        type="text" 
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        placeholder="Search..." 
        className="rounded-md outline-none bg-white w-full text-sm md:text-base" 
      />

      {isLoading && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md py-2 px-4 text-sm">
          Searching...
        </div>
      )}
      
      {error && (
        <div className="absolute top-full left-0 right-0 bg-red-50 text-red-600 shadow-md py-2 px-4 text-sm">
          {error}
        </div>
      )}
      
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md z-50 max-h-80 overflow-y-auto">
          {results.map((product: ProductSearchResult) => (
            <div 
              key={product.id} 
              className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b"
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
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}