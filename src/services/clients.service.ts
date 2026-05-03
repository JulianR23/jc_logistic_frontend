import type { ApiResponse } from "../types/api-response-wrapper.types";
import type { Client } from "../types/client.types";
import { apiClient } from "./api.client";

export const clientsService = {
  getAll: async (): Promise<Client[]> => {
    const { data } = await apiClient.get<ApiResponse<Client[]>>("/customers");
    return data.data;
  },

  getById: async (id: string): Promise<Client> => {
    const { data } = await apiClient.get<ApiResponse<Client>>(
      `/customers/${id}`,
    );
    return data.data;
  },

  create: async (
    payload: Omit<Client, "id" | "createdAt" | "updatedAt">,
  ): Promise<Client> => {
    const { data } = await apiClient.post<ApiResponse<Client>>(
      "/customers",
      payload,
    );
    return data.data;
  },

  update: async (
    id: string,
    payload: Partial<Omit<Client, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Client> => {
    const { data } = await apiClient.put<ApiResponse<Client>>(
      `/customers/${id}`,
      payload,
    );
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  },
};
