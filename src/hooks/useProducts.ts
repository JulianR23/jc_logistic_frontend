import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../services";
import { useUiStore } from "../store/ui.store";
import { QUERY_KEYS } from "./queryKeys";

export const useProducts = () =>
  useQuery({ queryKey: QUERY_KEYS.products, queryFn: productsService.getAll });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: (payload: { name: string; description?: string }) =>
      productsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
      showToast("Producto creado exitosamente", "success");
    },
    onError: () => showToast("Error al crear el producto", "error"),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { name?: string; description?: string | null };
    }) =>
      productsService.update(id, {
        ...payload,
        description: payload.description ?? undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
      showToast("Producto actualizado exitosamente", "success");
    },
    onError: () => showToast("Error al actualizar el producto", "error"),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: productsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
      showToast("Producto eliminado", "success");
    },
    onError: () => showToast("Error al eliminar el producto", "error"),
  });
};
