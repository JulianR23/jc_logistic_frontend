import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { portsService } from "../services";
import { useUiStore } from "../store/ui.store";
import type { Port } from "../types";
import { QUERY_KEYS } from "./queryKeys";

export const usePorts = () =>
  useQuery({ queryKey: QUERY_KEYS.ports, queryFn: portsService.getAll });

export const useCreatePort = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: (payload: Omit<Port, "id" | "createdAt" | "updatedAt">) =>
      portsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ports });
      showToast("Puerto creado exitosamente", "success");
    },
    onError: () => showToast("Error al crear el puerto", "error"),
  });
};

export const useUpdatePort = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Omit<Port, "id" | "createdAt" | "updatedAt">>;
    }) => portsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ports });
      showToast("Puerto actualizado exitosamente", "success");
    },
    onError: () => showToast("Error al actualizar el puerto", "error"),
  });
};

export const useDeletePort = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: portsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ports });
      showToast("Puerto eliminado", "success");
    },
    onError: () => showToast("Error al eliminar el puerto", "error"),
  });
};
