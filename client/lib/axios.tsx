import axios from "axios";
import { useAuthStore } from "@/store/authStore";



const api = axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers : {
      "Content-Type" : "application/json"
    }
})

api.interceptors.request.use(
    (config) =>{
        const accessToken  = useAuthStore.getState().accessToken;
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config
    }, 
    (error) => Promise.reject(error)
)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Log the error to see its structure and details
      console.error("Axios error:", error);

      // You can access:
      // error.response: The response object from the server (if any)
      // error.response.data: The actual error message/data from the backend
      // error.message: The error message string
      // error.config: The original request config

      // Example: Show error message from backend
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