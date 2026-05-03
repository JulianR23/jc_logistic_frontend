import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shipmentsService, type CreateShipmentPayload } from "../services";
import { useUiStore } from "../store/ui.store";
import type { BulkJobResponse } from "../types/api-response-wrapper.types";
import type { Shipment } from "../types/shipment.types";
import { QUERY_KEYS } from "./queryKeys";

export const useShipments = () =>
  useQuery({
    queryKey: QUERY_KEYS.shipments,
    queryFn: shipmentsService.getAll,
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
    onError: () => showToast("Error al eliminar el envío", "error"),
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
