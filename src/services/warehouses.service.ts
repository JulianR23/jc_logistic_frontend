import type { ApiResponse } from "../types/api-response-wrapper.types";
import type { Warehouse } from "../types/warehouse.types";
import { apiClient } from "./api.client";

export const warehousesService = {
  getAll: async (): Promise<Warehouse[]> => {
    const { data } =
      await apiClient.get<ApiResponse<Warehouse[]>>("/warehouses");
    return data.data;
  },

  create: async (
    payload: Omit<Warehouse, "id" | "createdAt" | "updatedAt">,
  ): Promise<Warehouse> => {
    const { data } = await apiClient.post<ApiResponse<Warehouse>>(
      "/warehouses",
      payload,
    );
    return data.data;
  },

  update: async (
    id: string,
    payload: Partial<Omit<Warehouse, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Warehouse> => {
    const { data } = await apiClient.put<ApiResponse<Warehouse>>(
      `/warehouses/${id}`,
      payload,
    );
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/warehouses/${id}`);
  },
};
