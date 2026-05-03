import type { Product } from "../types/product.types";
import type { ApiResponse } from "../types/api-response-wrapper.types";
import { apiClient } from "./api.client";

export const productsService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>("/products");
    return data.data;
  },

  create: async (payload: {
    name: string;
    description?: string;
  }): Promise<Product> => {
    const { data } = await apiClient.post<ApiResponse<Product>>(
      "/products",
      payload,
    );
    return data.data;
  },

  update: async (
    id: string,
    payload: { name?: string; description?: string },
  ): Promise<Product> => {
    const { data } = await apiClient.put<ApiResponse<Product>>(
      `/products/${id}`,
      payload,
    );
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
