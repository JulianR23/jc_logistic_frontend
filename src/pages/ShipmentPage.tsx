import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import * as yup from "yup";
import {
  Button,
  ConfirmDialog,
  EmptyState,
  Input,
  LoadingSpinner,
  Modal,
  PageHeader,
  Select,
} from "../components/ui";
import {
  Eye as VisibilityIcon,
  Trash2 as DeleteIcon,
  Ban as BlockIcon,
} from "lucide-react";
import {
  useClients,
  useCreateShipment,
  useDeleteShipment,
  usePorts,
  useProducts,
  useRejectShipment,
  useShipments,
  useWarehouses,
} from "../hooks";
import { shipmentSchema } from "../schemas";
import type { Shipment } from "../types";

type ShipmentForm = yup.InferType<typeof shipmentSchema>;

const ShipmentDetailModal = ({
  shipment,
  onClose,
}: {
  shipment: Shipment;
  onClose: () => void;
}) => {
  const totalUnits = shipment.products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <Modal isOpen title={`Envío ${shipment.trackingNumber}`} onClose={onClose}>
      <div className="flex flex-col gap-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-gray-400 text-xs">Tipo</p>
            <p className="font-medium">
              {shipment.transportMode === "LAND" ? "Terrestre" : "Marítimo"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Cliente</p>
            <p className="font-medium">{shipment.customer.companyName}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Precio base</p>
            <p className="font-medium">
              ${Number(shipment.basePrice).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Descuento</p>
            <p className="font-medium text-green-600">
              -${Number(shipment.discountValue).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Precio final</p>
            <p className="font-bold text-blue-600">
              ${Number(shipment.totalCost).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Total unidades</p>
            <p className="font-medium">{totalUnits}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Fecha entrega</p>
            <p className="font-medium">
              {new Date(shipment.deliveryDate).toLocaleDateString()}
            </p>
          </div>
          {shipment.land?.licensePlate && (
            <div>
              <p className="text-gray-400 text-xs">Placa</p>
              <p className="font-mono font-medium">
                {shipment.land.licensePlate}
              </p>
            </div>
          )}
          {shipment.maritime?.fleetNumber && (
            <div>
              <p className="text-gray-400 text-xs">Flota</p>
              <p className="font-mono font-medium">
                {shipment.maritime.fleetNumber}
              </p>
            </div>
          )}
          {shipment.land?.warehouse && (
            <div>
              <p className="text-gray-400 text-xs">Bodega</p>
              <p className="font-medium">{shipment.land.warehouse.name}</p>
            </div>
          )}
          {shipment.maritime?.seaPort && (
            <div>
              <p className="text-gray-400 text-xs">Puerto</p>
              <p className="font-medium">{shipment.maritime.seaPort.name}</p>
            </div>
          )}
        </div>

        <div>
          <p className="text-gray-400 text-xs mb-2">Productos</p>
          <div className="flex flex-col gap-1">
            {shipment.products.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between bg-gray-50 px-3 py-2 rounded-lg"
              >
                <span>{item.product.name}</span>
                <span className="font-medium">{item.quantity} und.</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const ShipmentsPage = () => {
  const { data: shipments, isLoading } = useShipments();
  const { data: clients = [] } = useClients();
  const { data: products = [] } = useProducts();
  const { data: warehouses = [] } = useWarehouses();
  const { data: ports = [] } = usePorts();

  const createShipment = useCreateShipment();
  const deleteShipment = useDeleteShipment();
  const rejectShipment = useRejectShipment();

  const [modalOpen, setModalOpen] = useState(false);
  const [detailShipment, setDetailShipment] = useState<Shipment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const getStatus = (s: Shipment) => {
    if (s.status === "REJECTED")
      return { label: "Rechazado", cls: "bg-red-100 text-red-700" };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const delivery = new Date(s.deliveryDate);
    delivery.setHours(0, 0, 0, 0);
    return delivery >= today
      ? { label: "Pendiente", cls: "bg-yellow-100 text-yellow-700" }
      : { label: "Entregado", cls: "bg-green-100 text-green-700" };
  };

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShipmentForm>({
    resolver: yupResolver(shipmentSchema) as unknown as Resolver<ShipmentForm>,
    defaultValues: { items: [{ productId: "", quantity: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const logisticType = watch("logisticType");

  const handleClose = () => {
    setModalOpen(false);
    reset({ items: [{ productId: "", quantity: 1 }] });
  };

  const handleSave = async (data: ShipmentForm) => {
    await createShipment.mutateAsync({
      guideNumber: data.guideNumber,
      logisticType: data.logisticType as "LAND" | "MARITIME",
      clientId: data.clientId,
      basePrice: data.basePrice,
      deliveryAt: data.deliveryAt,
      items: data.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
      vehiclePlate: data.vehiclePlate,
      warehouseId: data.warehouseId,
      fleetNumber: data.fleetNumber,
      portId: data.portId,
    });
    handleClose();
  };

  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader
        title="Envíos"
        action={
          <Button onClick={() => setModalOpen(true)} aria-label="Crear envío">
            + Nuevo envío
          </Button>
        }
      />

      {!shipments?.length ? (
        <EmptyState message="No hay envíos registrados" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Guía",
                  "Cliente",
                  "Tipo",
                  "Unidades",
                  "Precio final",
                  "Entrega",
                  "Estado",
                  "Acciones",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    {s.trackingNumber}
                  </td>
                  <td className="px-4 py-3">{s.customer.companyName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.transportMode === "LAND"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-teal-100 text-teal-700"
                      }`}
                    >
                      {s.transportMode === "LAND" ? "Terrestre" : "Marítimo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {s.products.reduce((sum, p) => sum + p.quantity, 0)}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ${Number(s.totalCost).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(s.deliveryDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {(() => {
                      const { label, cls } = getStatus(s);
                      return (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}
                        >
                          {label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setDetailShipment(s)}
                      aria-label={`Ver detalle ${s.trackingNumber}`}
                    >
                      <VisibilityIcon size={18} />
                    </Button>
                    {getStatus(s).label === "Pendiente" && (
                      <Button
                        variant="ghost"
                        onClick={() => setRejectTarget(s.id)}
                        aria-label={`Rechazar ${s.trackingNumber}`}
                      >
                        <BlockIcon size={18} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => setDeleteTarget(s.id)}
                      aria-label={`Eliminar ${s.trackingNumber}`}
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

      {/* Modal crear envío */}
      <Modal isOpen={modalOpen} title="Nuevo envío" onClose={handleClose}>
        <form
          onSubmit={handleSubmit(handleSave)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Número de guía"
              placeholder="AB12345678"
              {...register("guideNumber")}
              error={errors.guideNumber?.message}
              aria-label="Número de guía"
            />
            <Select
              label="Tipo de logística"
              {...register("logisticType")}
              error={errors.logisticType?.message}
              aria-label="Tipo de logística"
              placeholder="Seleccionar"
              options={[
                { value: "LAND", label: "Terrestre" },
                { value: "MARITIME", label: "Marítimo" },
              ]}
            />
          </div>

          <Select
            label="Cliente"
            {...register("clientId")}
            error={errors.clientId?.message}
            aria-label="Cliente"
            placeholder="Seleccionar cliente"
            options={clients.map((c) => ({
              value: c.id,
              label: c.companyName,
            }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Precio base"
              type="number"
              step="0.01"
              {...register("basePrice", { valueAsNumber: true })}
              error={errors.basePrice?.message}
              aria-label="Precio base"
            />
            <Input
              label="Fecha de entrega"
              type="date"
              min={todayStr}
              {...register("deliveryAt")}
              error={errors.deliveryAt?.message}
              aria-label="Fecha de entrega"
            />
          </div>

          {/* Campos condicionales terrestre */}
          {logisticType === "LAND" && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 rounded-lg">
              <Input
                label="Placa del vehículo"
                placeholder="AAA123"
                {...register("vehiclePlate")}
                error={errors.vehiclePlate?.message}
                aria-label="Placa"
              />
              <Select
                label="Bodega de entrega"
                {...register("warehouseId")}
                error={errors.warehouseId?.message}
                aria-label="Bodega"
                placeholder="Seleccionar bodega"
                options={warehouses.map((w) => ({
                  value: w.id,
                  label: `${w.name} - ${w.city}`,
                }))}
              />
            </div>
          )}

          {/* Campos condicionales marítimo */}
          {logisticType === "MARITIME" && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-teal-50 rounded-lg">
              <Input
                label="Número de flota"
                placeholder="AAA1234A"
                {...register("fleetNumber")}
                error={errors.fleetNumber?.message}
                aria-label="Flota"
              />
              <Select
                label="Puerto de entrega"
                {...register("portId")}
                error={errors.portId?.message}
                aria-label="Puerto"
                placeholder="Seleccionar puerto"
                options={ports.map((p) => ({
                  value: p.id,
                  label: `${p.name} - ${p.country}`,
                }))}
              />
            </div>
          )}

          {/* Productos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Productos
              </label>
              <Button
                type="button"
                variant="ghost"
                onClick={() => append({ productId: "", quantity: 1 })}
                aria-label="Agregar producto"
                className="text-xs"
              >
                + Agregar
              </Button>
            </div>
            {errors.items && typeof errors.items.message === "string" && (
              <p className="text-xs text-red-500 mb-2">
                {errors.items.message}
              </p>
            )}
            <div className="flex flex-col gap-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Select
                      label=""
                      {...register(`items.${index}.productId`)}
                      error={errors.items?.[index]?.productId?.message}
                      aria-label={`Producto ${index + 1}`}
                      placeholder="Seleccionar producto"
                      options={products.map((p) => ({
                        value: p.id,
                        label: p.name,
                      }))}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      label=""
                      type="number"
                      min={1}
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      error={errors.items?.[index]?.quantity?.message}
                      aria-label={`Cantidad producto ${index + 1}`}
                    />
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label={`Eliminar producto ${index + 1}`}
                      className="mt-1 text-red-400 hover:text-red-600"
                    >
                      <DeleteIcon size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" type="button" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Crear envío
            </Button>
          </div>
        </form>
      </Modal>

      {detailShipment && (
        <ShipmentDetailModal
          shipment={detailShipment}
          onClose={() => setDetailShipment(null)}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        message="¿Estás seguro de eliminar este envío? Esta acción no se puede deshacer."
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteShipment.mutateAsync(deleteTarget);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteShipment.isPending}
      />

      <ConfirmDialog
        isOpen={!!rejectTarget}
        message="¿Estás seguro de rechazar este envío?"
        onConfirm={async () => {
          if (rejectTarget) {
            await rejectShipment.mutateAsync(rejectTarget);
            setRejectTarget(null);
          }
        }}
        onCancel={() => setRejectTarget(null)}
        isLoading={rejectShipment.isPending}
      />
    </div>
  );
};
