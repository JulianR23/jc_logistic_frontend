import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { warehousesService } from "../services";
import { useUiStore } from "../store/ui.store";
import type { Warehouse } from "../types";
import { QUERY_KEYS } from "./queryKeys";

export const useWarehouses = () =>
  useQuery({
    queryKey: QUERY_KEYS.warehouses,
    queryFn: warehousesService.getAll,
  });

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: (payload: Omit<Warehouse, "id" | "createdAt" | "updatedAt">) =>
      warehousesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.warehouses });
      showToast("Bodega creada exitosamente", "success");
    },
    onError: () => showToast("Error al crear la bodega", "error"),
  });
};

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Omit<Warehouse, "id" | "createdAt" | "updatedAt">>;
    }) => warehousesService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.warehouses });
      showToast("Bodega actualizada exitosamente", "success");
    },
    onError: () => showToast("Error al actualizar la bodega", "error"),
  });
};

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: warehousesService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.warehouses });
      showToast("Bodega eliminada", "success");
    },
    onError: () => showToast("Error al eliminar la bodega", "error"),
  });
};
