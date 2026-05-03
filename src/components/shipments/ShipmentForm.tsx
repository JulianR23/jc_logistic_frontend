import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import * as yup from "yup";
import { shipmentSchema } from "../../schemas";
import { Button, Input, Modal, Select } from "../ui";
import { ShipmentItemRow } from "./ShipmentItemRow";
import type { Client, Port, Product, Warehouse } from "../../types";
import type { CreateShipmentPayload } from "../../services";

type ShipmentForm = yup.InferType<typeof shipmentSchema>;

type ShipmentFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateShipmentPayload) => Promise<void>;
  clients: Client[];
  products: Product[];
  warehouses: Warehouse[];
  ports: Port[];
  isSubmitting: boolean;
};

/**
 * Formulario de creación de envío.
 * Extraído de ShipmentsPage para mantener la separación de responsabilidades.
 *
 * Muestra campos condicionales según el tipo de logística:
 * - TERRESTRIAL: vehiclePlate + warehouseId
 * - MARITIME:    fleetNumber + portId
 */
export const ShipmentForm = ({
  isOpen,
  onClose,
  onSubmit,
  clients,
  products,
  warehouses,
  ports,
  isSubmitting,
}: ShipmentFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<ShipmentForm>({
    resolver: yupResolver(shipmentSchema) as unknown as Resolver<ShipmentForm>,
    defaultValues: { items: [{ productId: "", quantity: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const logisticType = watch("logisticType");

  const handleClose = () => {
    reset({ items: [{ productId: "", quantity: 1 }] });
    onClose();
  };

  const handleSave = async (data: ShipmentForm) => {
    await onSubmit({
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

  return (
    <Modal isOpen={isOpen} title="Nuevo envío" onClose={handleClose}>
      <form
        onSubmit={handleSubmit(handleSave)}
        className="flex flex-col gap-4"
        noValidate
      >
        {/* Guía y tipo */}
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

        {/* Cliente */}
        <Select
          label="Cliente"
          {...register("clientId")}
          error={errors.clientId?.message}
          aria-label="Cliente"
          placeholder="Seleccionar cliente"
          options={clients.map((c) => ({ value: c.id, label: c.companyName }))}
        />

        {/* Precio y fecha */}
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
            {...register("deliveryAt")}
            error={errors.deliveryAt?.message}
            aria-label="Fecha de entrega"
          />
        </div>

        {/* Campos exclusivos TERRESTRIAL */}
        {logisticType === "LAND" && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Input
              label="Placa del vehículo"
              placeholder="AAA123"
              {...register("vehiclePlate")}
              error={errors.vehiclePlate?.message}
              aria-label="Placa del vehículo"
            />
            <Select
              label="Bodega de entrega"
              {...register("warehouseId")}
              error={errors.warehouseId?.message}
              aria-label="Bodega de entrega"
              placeholder="Seleccionar bodega"
              options={warehouses.map((w) => ({
                value: w.id,
                label: `${w.name} — ${w.city}`,
              }))}
            />
          </div>
        )}

        {/* Campos exclusivos MARITIME */}
        {logisticType === "MARITIME" && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-teal-50 rounded-lg border border-teal-100">
            <Input
              label="Número de flota"
              placeholder="AAA1234A"
              {...register("fleetNumber")}
              error={errors.fleetNumber?.message}
              aria-label="Número de flota"
            />
            <Select
              label="Puerto de entrega"
              {...register("portId")}
              error={errors.portId?.message}
              aria-label="Puerto de entrega"
              placeholder="Seleccionar puerto"
              options={ports.map((p) => ({
                value: p.id,
                label: `${p.name} — ${p.country}`,
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
              aria-label="Agregar producto al envío"
              className="text-xs"
            >
              + Agregar producto
            </Button>
          </div>

          {errors.items && typeof errors.items.message === "string" && (
            <p className="text-xs text-red-500 mb-2">{errors.items.message}</p>
          )}

          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <ShipmentItemRow
                key={field.id}
                index={index}
                products={products}
                register={register}
                errors={errors}
                canRemove={fields.length > 1}
                onRemove={remove}
              />
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
  );
};
