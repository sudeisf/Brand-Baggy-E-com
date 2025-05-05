import axios from "axios";
import { useAuthStore } from "@/store/authStore";



const api = axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_URL,
    headers : {
      "Content-Type" : "application/json"
    }
})

api.interceptors.request.use(

    (config) =>{
        // Skip interceptor logic if skipAuth is set
        if ((config as any).skipAuth) {
          return config;
        }

        const accessToken  = useAuthStore.getState().accessToken;
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
      console.error("Axios error:", error);
      if (error.response && error.response.data) {
        console.error("Backend error message:", error.response.data);
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