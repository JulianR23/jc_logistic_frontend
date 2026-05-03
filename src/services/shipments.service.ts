import type {
  ApiResponse,
  BulkJobResponse,
} from "../types/api-response-wrapper.types";
import type { Shipment } from "../types/shipment.types";
import { apiClient } from "./api.client";

export type CreateShipmentPayload = {
  logisticType: "LAND" | "MARITIME";
  clientId: string;
  deliveryAt: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
  vehiclePlate?: string;
  warehouseId?: string;
  fleetNumber?: string;
  portId?: string;
  guideNumber?: string;
};

export const shipmentsService = {
  getAll: async (): Promise<Shipment[]> => {
    const { data } = await apiClient.get<ApiResponse<Shipment[]>>("/shipments");
    return data.data;
  },

  getById: async (id: string): Promise<Shipment> => {
    const { data } = await apiClient.get<ApiResponse<Shipment>>(
      `/shipments/${id}`,
    );
    return data.data;
  },

  getByClient: async (clientId: string): Promise<Shipment[]> => {
    const { data } = await apiClient.get<ApiResponse<Shipment[]>>(
      `/shipments/client/${clientId}`,
    );
    return data.data;
  },

  create: async (
    payload: CreateShipmentPayload,
  ): Promise<Shipment | BulkJobResponse> => {
    const { data } = await apiClient.post<
      ApiResponse<Shipment | BulkJobResponse>
    >("/shipments", payload);
    return data.data;
  },

  getNextTrackingNumber: async (): Promise<string> => {
    const { data } = await apiClient.get<
      ApiResponse<{ trackingNumber: string }>
    >("/shipments/next-tracking-number");
    return data.data.trackingNumber;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/shipments/${id}`);
  },

  reject: async (id: string): Promise<Shipment> => {
    const { data } = await apiClient.patch<ApiResponse<Shipment>>(
      `/shipments/${id}/reject`,
    );
    return data.data;
  },
};
