import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "../services";
import { useUiStore } from "../store/ui.store";
import type { Client } from "../types";
import { QUERY_KEYS } from "./queryKeys";

function getApiError(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const data = (error as { response?: { data?: { message?: unknown } } })
      .response?.data;
    if (Array.isArray(data?.message)) return data.message.join(", ");
    if (typeof data?.message === "string") return data.message;
  }
  return fallback;
}

export const useClients = () =>
  useQuery({ queryKey: QUERY_KEYS.clients, queryFn: clientsService.getAll });

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: (payload: Omit<Client, "id" | "createdAt" | "updatedAt">) =>
      clientsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients });
      showToast("Cliente creado exitosamente", "success");
    },
    onError: (error) =>
      showToast(getApiError(error, "Error al crear el cliente"), "error"),
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Omit<Client, "id" | "createdAt" | "updatedAt">>;
    }) => clientsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients });
      showToast("Cliente actualizado exitosamente", "success");
    },
    onError: (error) =>
      showToast(getApiError(error, "Error al actualizar el cliente"), "error"),
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: clientsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients });
      showToast("Cliente eliminado", "success");
    },
    onError: (error) =>
      showToast(getApiError(error, "Error al eliminar el cliente"), "error"),
  });
};
