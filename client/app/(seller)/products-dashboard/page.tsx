import ProductListPage from './ProductsTable';
import axios from 'axios';
import { cookies } from 'next/headers';
interface Category {
  id: number;
  name: string;
  parent: {
    id: number;
    name: string;
  };
}

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  in_stock: boolean;
  main_image: string;
  product_location: string;
  slug: string;
  category: Category;
};

const getProducts  = async () =>{
    try {
      const token =  (await cookies()).get('accessToken')?.value
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/seller/dashboard/`,{
        headers : {
          Authorization : `Bearer ${token}`
        }
      });
    
    if (response.status === 200) {
      return response.data.results.map((item: Product) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity : item.quantity,
        in_stock : item.in_stock,
        main_image : item.main_image,
        category: item.category,
        product_location: item.product_location,
        status: item.in_stock,
        slug: item.slug
      }));
    }
    return [];
  }catch(error){
    console.error("lose",error);
    return [];
  }
}


export default async function ProductsPage(){
  const initialProducts = await getProducts();
  return <ProductListPage initialProducts={initialProducts} />;
}