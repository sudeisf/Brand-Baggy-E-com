import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Include cookies for CSRF
  timeout: 30000, // 30-second timeout
});

// // Fetch CSRF token
// async function getCsrfToken() {
//   try {
//     const response = await api.get("/accounts/login/", { headers: {}, params: {}, skipCsrf: true } as any);
//     const csrfToken = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("csrftoken"))
//       ?.split("=")[1];
//     if (csrfToken) {
//       api.defaults.headers["X-CSRFToken"] = csrfToken;
//       return csrfToken;
//     }
//   } catch (error) {
//     console.error("Failed to fetch CSRF token:", error);
//   }
//   return null;
// }

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    if ((config as any).skipAuth) return config;

    const accessToken = useAuthStore.getState().accessToken;
    if (process.env.NODE_ENV !== "production") {
      console.log("Request URL:", config.url, "Access Token:", accessToken);
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // // Fetch CSRF token for POST requests
    // if (config.method?.toLowerCase() === "post" && !(config as any).skipCsrf) {
    //   await getCsrfToken();
    // }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (error.response?.status === 401 && originalRequest._retryCount < 2) {
      originalRequest._retryCount += 1;
      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        console.warn("No refresh token available, logging out...");
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        console.log("Attempting to refresh token...");
        await useAuthStore.getState().refreshAccessToken();
        const newAccessToken = useAuthStore.getState().accessToken;

        if (!newAccessToken) {
          throw new Error("Failed to get new access token");
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    console.error("Request failed:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default api;