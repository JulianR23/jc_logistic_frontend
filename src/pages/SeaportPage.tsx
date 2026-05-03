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
  useCreatePort,
  useDeletePort,
  usePorts,
  useUpdatePort,
} from "../hooks";
import { seaportSchema } from "../schemas";
import type { Port } from "../types";

type PortForm = yup.InferType<typeof seaportSchema>;

export const PortsPage = () => {
  const { data: ports, isLoading } = usePorts();
  const createPort = useCreatePort();
  const updatePort = useUpdatePort();
  const deletePort = useDeletePort();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Port | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PortForm>({
    resolver: yupResolver(seaportSchema) as unknown as Resolver<PortForm>,
  });

  const handleOpenCreate = () => {
    setEditTarget(null);
    reset({});
    setModalOpen(true);
  };
  const handleOpenEdit = (p: Port) => {
    setEditTarget(p);
    reset({
      name: p.name,
      city: p.city,
      country: p.country,
      address: p.address,
    });
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
    setEditTarget(null);
    reset({});
  };

  const handleSave = async (data: PortForm) => {
    const payload = data;
    if (editTarget) {
      await updatePort.mutateAsync({ id: editTarget.id, payload });
    } else {
      await createPort.mutateAsync(payload);
    }
    handleClose();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Puertos"
        action={
          <Button onClick={handleOpenCreate} aria-label="Crear puerto">
            + Nuevo puerto
          </Button>
        }
      />

      {!ports?.length ? (
        <EmptyState message="No hay puertos registrados" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Nombre", "Ciudad", "País", "Dirección", "Acciones"].map(
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
              {ports.map((port) => (
                <tr
                  key={port.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">{port.name}</td>
                  <td className="px-4 py-3 text-gray-500">{port.city}</td>
                  <td className="px-4 py-3 text-gray-500">{port.country}</td>
                  <td className="px-4 py-3 text-gray-500">{port.address}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleOpenEdit(port)}
                      aria-label={`Editar ${port.name}`}
                    >
                      <EditIcon size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setDeleteTarget(port.id)}
                      aria-label={`Eliminar ${port.name}`}
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
        title={editTarget ? "Editar puerto" : "Nuevo puerto"}
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
            aria-label="Nombre del puerto"
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
            error={errors.country?.message}
            aria-label="País"
          />
          <Input
            label="Dirección"
            {...register("address")}
            error={errors.address?.message}
            aria-label="Dirección del puerto"
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
        message="¿Estás seguro de eliminar este puerto?"
        onConfirm={async () => {
          if (deleteTarget) {
            await deletePort.mutateAsync(deleteTarget);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deletePort.isPending}
      />
    </div>
  );
};
