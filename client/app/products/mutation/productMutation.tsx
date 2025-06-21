// import { useAuthStore } from "@/store/authStore";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "@/lib/axios";
// type Product = {
//       id: number;
//       name: string;
//       price: number;
//       description: string;
//     };
    
// interface response {
//       success : boolean,
//       message : string
//       product : Product
// }
// export const useProductListMutation = () => {
//       const accessToken = useAuthStore((state)=> state.accessToken);
//       const queryClient = useQueryClient();
//       return useMutation<response,Error>({
//             mutationKey : ['productListMutaion'],
//             mutationFn: async ()=>{
//                   const response = await api.get('/product/product-list/',
//                         {
//                               headers : {
//                                     'Authorization': `Bearer ${accessToken}`,
//                               }
//                         }
//                   );
//                   if(response?.status !== 200){
//                         throw Error("couldn't fetch the products")
//                   }
//                   return{
//                         success : true,
//                         message : "products fetched succefully",
//                         product : response.data.results
//                   }
//             },onSuccess(data, variables, context) {
//                   queryClient.invalidateQueries({queryKey : ["productsList"]});
//             },
//       })
// }