import axios, { AxiosError } from "axios";
import type { AxiosInstance } from "axios";
import { useAuthStore } from "../store/auth.store";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

/**
 * Instancia de Axios configurada para la API de logística.
 * Interceptores:
 * - Request: inyecta el Bearer token desde el store de Zustand
 * - Response: en 401 limpia la sesión y redirige al login
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isAuthEndpoint = error.config?.url?.startsWith("/auth/");
    if (error.response?.status === 401 && !isAuthEndpoint) {
      useAuthStore.getState().clearSession();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
