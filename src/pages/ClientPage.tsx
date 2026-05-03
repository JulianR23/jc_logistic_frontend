import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
  useClients,
  useCreateClient,
  useDeleteClient,
  useUpdateClient,
} from "../hooks";
import { clientSchema } from "../schemas";
import type { Client } from "../types";

type ClientForm = yup.InferType<typeof clientSchema>;

export const ClientsPage = () => {
  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Client | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientForm>({
    resolver: yupResolver(clientSchema, { stripUnknown: true }),
  });

  const handleOpenCreate = () => {
    setEditTarget(null);
    reset({});
    setModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditTarget(client);
    reset({
      companyName: client.companyName,
      email: client.email,
      phone: client.phone,
      documentId: client.documentId,
    });
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditTarget(null);
    reset({});
  };

  const handleSave = async (data: ClientForm) => {
    if (editTarget) {
      await updateClient.mutateAsync({ id: editTarget.id, payload: data });
    } else {
      await createClient.mutateAsync(data);
    }
    handleClose();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteClient.mutateAsync(deleteTarget);
    setDeleteTarget(null);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Clientes"
        action={
          <Button onClick={handleOpenCreate} aria-label="Crear cliente">
            + Nuevo cliente
          </Button>
        }
      />

      {!clients?.length ? (
        <EmptyState message="No hay clientes registrados" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Nombre", "Email", "Teléfono", "Documento", "Acciones"].map(
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
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">
                    {client.companyName}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{client.email}</td>
                  <td className="px-4 py-3 text-gray-500">{client.phone}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {client.documentId}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleOpenEdit(client)}
                      aria-label={`Editar ${client.companyName}`}
                    >
                      <EditIcon size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setDeleteTarget(client.id)}
                      aria-label={`Eliminar ${client.companyName}`}
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
        title={editTarget ? "Editar cliente" : "Nuevo cliente"}
        onClose={handleClose}
      >
        <form
          onSubmit={handleSubmit(handleSave)}
          className="flex flex-col gap-4"
          noValidate
        >
          <Input
            label="Nombre"
            {...register("companyName")}
            error={errors.companyName?.message}
            aria-label="Nombre del cliente"
          />
          <Input
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            aria-label="Email"
          />
          <Input
            label="Teléfono"
            {...register("phone")}
            error={errors.phone?.message}
            aria-label="Teléfono"
          />
          <Input
            label="Documento"
            {...register("documentId")}
            error={errors.documentId?.message}
            aria-label="Documento"
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
        message="¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteClient.isPending}
      />
    </div>
  );
};
