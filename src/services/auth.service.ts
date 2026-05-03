import type { ApiResponse } from "../types/api-response-wrapper.types";
import type { AuthResponse } from "../types/auth.types";
import { apiClient } from "./api.client";

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      { email, password },
    );
    return data.data;
  },

  register: async (
    name: string,
    email: string,
    phone: string,
    nit: string,
    password: string,
  ): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      { name, email, phone, nit, password },
    );
    return data.data;
  },
};
