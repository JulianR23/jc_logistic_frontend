import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import * as yup from "yup";
import {
  Button,
  ConfirmDialog,
  EmptyState,
  Input,
  LoadingSpinner,
  Modal,
  PageHeader,
} from "../components/ui";
import { Pencil as EditIcon, Trash2 as DeleteIcon } from "lucide-react";
import {
  useCreateWarehouse,
  useDeleteWarehouse,
  useUpdateWarehouse,
  useWarehouses,
} from "../hooks";
import { warehouseSchema } from "../schemas";
import type { Warehouse } from "../types";

type WarehouseForm = yup.InferType<typeof warehouseSchema>;

export const WarehousesPage = () => {
  const { data: warehouses, isLoading } = useWarehouses();
  const createWarehouse = useCreateWarehouse();
  const updateWarehouse = useUpdateWarehouse();
  const deleteWarehouse = useDeleteWarehouse();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Warehouse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WarehouseForm>({
    resolver: yupResolver(
      warehouseSchema,
    ) as unknown as Resolver<WarehouseForm>,
  });

  const handleOpenCreate = () => {
    setEditTarget(null);
    reset({});
    setModalOpen(true);
  };
  const handleOpenEdit = (w: Warehouse) => {
    setEditTarget(w);
    reset({
      name: w.name,
      address: w.address,
      city: w.city,
      country: w.country,
    });
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
    setEditTarget(null);
    reset({});
  };

  const handleSave = async (data: WarehouseForm) => {
    const payload = { ...data, country: data.country ?? "Colombia" };
    if (editTarget) {
      await updateWarehouse.mutateAsync({ id: editTarget.id, payload });
    } else {
      await createWarehouse.mutateAsync(
        payload as Omit<Warehouse, "id" | "createdAt" | "updatedAt">,
      );
    }
    handleClose();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Bodegas"
        action={
          <Button onClick={handleOpenCreate} aria-label="Crear bodega">
            + Nueva bodega
          </Button>
        }
      />

      {!warehouses?.length ? (
        <EmptyState message="No hay bodegas registradas" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Nombre", "Dirección", "Ciudad", "País", "Acciones"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {warehouses.map((w) => (
                <tr
                  key={w.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">{w.name}</td>
                  <td className="px-4 py-3 text-gray-500">{w.address}</td>
                  <td className="px-4 py-3 text-gray-500">{w.city}</td>
                  <td className="px-4 py-3 text-gray-500">{w.country}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleOpenEdit(w)}
                      aria-label={`Editar ${w.name}`}
                    >
                      <EditIcon size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setDeleteTarget(w.id)}
                      aria-label={`Eliminar ${w.name}`}
                    >
                      <DeleteIcon size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        title={editTarget ? "Editar bodega" : "Nueva bodega"}
        onClose={handleClose}
      >
        <form
          onSubmit={handleSubmit(handleSave)}
          className="flex flex-col gap-4"
          noValidate
        >
          <Input
            label="Nombre"
            {...register("name")}
            error={errors.name?.message}
            aria-label="Nombre de la bodega"
          />
          <Input
            label="Dirección"
            {...register("address")}
            error={errors.address?.message}
            aria-label="Dirección"
          />
          <Input
            label="Ciudad"
            {...register("city")}
            error={errors.city?.message}
            aria-label="Ciudad"
          />
          <Input
            label="País"
            {...register("country")}
            placeholder="Colombia"
            aria-label="País"
          />
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" type="button" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Guardar
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        message="¿Estás seguro de eliminar esta bodega?"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteWarehouse.mutateAsync(deleteTarget);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteWarehouse.isPending}
      />
    </div>
  );
};
