import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 30000,
});

let refreshPromise: Promise<string | null> | null = null;

function isRefreshRequest(config?: { url?: string }) {
  return Boolean(config?.url?.includes("accounts/token/refresh"));
}

function forceLogout() {
  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    user: null,
  });
  if (typeof window !== "undefined") {
    document.cookie = "accessToken=; Max-Age=0; path=/";
    if (!window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
  }
}

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

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Never try to refresh while refreshing — stops the 401 flood
    if (isRefreshRequest(originalRequest) || (originalRequest as any)._retry) {
      forceLogout();
      return Promise.reject(error);
    }

    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) {
      forceLogout();
      return Promise.reject(error);
    }

    (originalRequest as any)._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = useAuthStore
          .getState()
          .refreshAccessToken()
          .then(() => useAuthStore.getState().accessToken)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;
      if (!newAccessToken) {
        throw new Error("Failed to get new access token");
      }

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      forceLogout();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
