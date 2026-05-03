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
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "../hooks";
import { productSchema } from "../schemas";
import type { Product } from "../types";

type ProductForm = yup.InferType<typeof productSchema>;

export const ProductsPage = () => {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    resolver: yupResolver(productSchema, {
      stripUnknown: true,
    }) as unknown as Resolver<ProductForm>,
  });

  const handleOpenCreate = () => {
    setEditTarget(null);
    reset({});
    setModalOpen(true);
  };
  const handleOpenEdit = (p: Product) => {
    setEditTarget(p);
    reset({
      name: p.name,
      typeProduct: p.typeProduct,
      description: p.description ?? undefined,
      sku: p.sku,
    });
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
    setEditTarget(null);
    reset({});
  };

  const handleSave = async (data: ProductForm) => {
    if (editTarget) {
      await updateProduct.mutateAsync({ id: editTarget.id, payload: data });
    } else {
      await createProduct.mutateAsync(data);
    }
    handleClose();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Productos"
        action={
          <Button onClick={handleOpenCreate} aria-label="Crear producto">
            + Nuevo producto
          </Button>
        }
      />

      {!products?.length ? (
        <EmptyState message="No hay productos registrados" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Nombre", "Tipo", "SKU", "Descripción", "Acciones"].map(
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
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {product.typeProduct}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{product.sku}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {product.description ?? "—"}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleOpenEdit(product)}
                      aria-label={`Editar ${product.name}`}
                    >
                      <EditIcon size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setDeleteTarget(product.id)}
                      aria-label={`Eliminar ${product.name}`}
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
        title={editTarget ? "Editar producto" : "Nuevo producto"}
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
            aria-label="Nombre del producto"
          />
          <Input
            label="Tipo de producto"
            {...register("typeProduct")}
            error={errors.typeProduct?.message}
            aria-label="Tipo de producto"
          />
          <Input
            label="SKU"
            {...register("sku")}
            error={errors.sku?.message}
            aria-label="SKU"
          />
          <Input
            label="Descripción"
            {...register("description")}
            error={errors.description?.message}
            aria-label="Descripción"
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
        message="¿Estás seguro de eliminar este producto?"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteProduct.mutateAsync(deleteTarget);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
};
