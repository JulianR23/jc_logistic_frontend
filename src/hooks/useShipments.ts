import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import {
  shipmentsService,
  type CreateShipmentPayload,
  type UpdateShipmentPayload,
} from "../services";
import { useUiStore } from "../store/ui.store";
import type { BulkJobResponse } from "../types/api-response-wrapper.types";
import type { Shipment } from "../types/shipment.types";
import { QUERY_KEYS } from "./queryKeys";

export const useShipments = () =>
  useQuery({
    queryKey: QUERY_KEYS.shipments,
    queryFn: shipmentsService.getAll,
  });

export const useNextTrackingNumber = (enabled: boolean) =>
  useQuery({
    queryKey: QUERY_KEYS.nextTrackingNumber,
    queryFn: shipmentsService.getNextTrackingNumber,
    enabled,
    staleTime: 0,
    gcTime: 0,
  });

export const useCreateShipment = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: (payload: CreateShipmentPayload) =>
      shipmentsService.create(payload),
    onSuccess: (data: Shipment | BulkJobResponse) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.shipments });
      const isBulk = "jobId" in data;
      showToast(
        isBulk ? (data as BulkJobResponse).message : "Envío creado exitosamente",
        "success",
      );
    },
    onError: () => showToast("Error al crear el envío", "error"),
  });
};

export const useDeleteShipment = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: shipmentsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.shipments });
      showToast("Envío eliminado", "success");
    },
    onError: (error: AxiosError<{ message: string }>) =>
      showToast(
        error.response?.data?.message ?? "Error al eliminar el envío",
        "error",
      ),
  });
};

export const useUpdateShipment = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateShipmentPayload }) =>
      shipmentsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.shipments });
      showToast("Envío actualizado exitosamente", "success");
    },
    onError: () => showToast("Error al actualizar el envío", "error"),
  });
};

export const useRejectShipment = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: shipmentsService.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.shipments });
      showToast("Envío rechazado", "success");
    },
    onError: () => showToast("Error al rechazar el envío", "error"),
  });
};
