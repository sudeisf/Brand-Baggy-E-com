import ProductsView from "./components/productsView";
import { fetchProducts } from "./server";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    parent_category?: string;
    child_category?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  
  // Parse query parameters with proper type safety
  const currentPage = typeof params.page === 'string' ? Math.max(1, parseInt(params.page)) : 1;
  const parentCategory = typeof params.parent_category === 'string' ? params.parent_category : undefined;
  const childCategory = typeof params.child_category === 'string' ? params.child_category : undefined;
  const sortOrder = typeof params.sort === 'string' ? params.sort : undefined;

  // Fetch products with current filters
  const { products, count, next, previous } = await fetchProducts({
    page: currentPage,
    parent_category: parentCategory,
    child_category: childCategory,
    sort: sortOrder
  });

  return (
    <ProductsView 
      initialData={{
        products,
        count,
        next,
        previous
      }} 
    />
  );
}