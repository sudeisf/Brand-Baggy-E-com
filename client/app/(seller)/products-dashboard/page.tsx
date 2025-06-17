import ProductListPage from './ProductsTable';
import api from '@/lib/axios'
import { useAuthStore } from '@/store/authStore';
interface category {
  id : number;
  name : string;
  parent :{
        id : number,
        name : string,
  }
}
type product  = {
  id : number,
  name : string,
  price : number,
  quantity : number,
  in_stock : boolean,
  main_image :string,
  product_location: string,
  slug: string,
  catagory : category
}
const getProducts  = async () =>{
    try {
      const accessToken  = useAuthStore((state)=>state.accessToken);
      const response = await api.get('/product/seller/dashboard/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
    });
    
    if (response.status === 200) {
      return response.data.results.map((item: product) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity : item.quantity,
        in_stock : item.product_location,
        main_image : item.main_image,
        category: item.catagory,
        store: item.product_location,
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