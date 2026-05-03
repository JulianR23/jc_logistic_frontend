import type { ApiResponse } from "../types/api-response-wrapper.types";
import type { Port } from "../types/seaport";
import { apiClient } from "./api.client";

export const portsService = {
  getAll: async (): Promise<Port[]> => {
    const { data } = await apiClient.get<ApiResponse<Port[]>>("/ports");
    return data.data;
  },

  create: async (
    payload: Omit<Port, "id" | "createdAt" | "updatedAt">,
  ): Promise<Port> => {
    const { data } = await apiClient.post<ApiResponse<Port>>("/ports", payload);
    return data.data;
  },

  update: async (
    id: string,
    payload: Partial<Omit<Port, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Port> => {
    const { data } = await apiClient.put<ApiResponse<Port>>(
      `/ports/${id}`,
      payload,
    );
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/ports/${id}`);
  },
};
