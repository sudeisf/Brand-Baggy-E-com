import axios from "axios";
import { useAuthStore } from "@/store/authStore";


const api = axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_URL,
    headers : {
      "Content-Type" : "application/json"
    }
})
console.log(process.env.NEXT_PUBLIC_API_URL)

api.interceptors.request.use(

    (config) =>{
        if ((config as any).skipAuth) {
          return config;
        }
        const accessToken  = useAuthStore.getState().accessToken;
        if (process.env.NODE_ENV !== "production") {
          console.log("Access Token:", accessToken);
        }
        if (typeof window === "undefined" && !accessToken) {
          console.warn("No access token found during SSR. Authenticated requests will fail.");
        }
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config
    }, 
    (error) => Promise.reject(error)
 );

api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (process.env.NODE_ENV !== "production") {
        console.error("Axios error:", error);
      }
      if (error.response && error.response.data) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Backend error message:", error.response.data);
        }
      }

      const originalRequest = error.config;
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        useAuthStore.getState().refreshToken
      ) {
        originalRequest._retry = true;
  
        try {
          await useAuthStore.getState().refreshAccessToken(); 
          const newAccessToken = useAuthStore.getState().accessToken;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );
  


export default api;