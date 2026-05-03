import type {
  UseFieldArrayRemove,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import * as yup from "yup";
import { Select, Input } from "../ui";
import { Trash2 as DeleteIcon } from "lucide-react";
import { shipmentSchema } from "../../schemas";
import type { Product } from "../../types";

type ShipmentForm = yup.InferType<typeof shipmentSchema>;

type ShipmentItemRowProps = {
  index: number;
  products: Product[];
  register: UseFormRegister<ShipmentForm>;
  errors: FieldErrors<ShipmentForm>;
  canRemove: boolean;
  onRemove: UseFieldArrayRemove;
};

/**
 * Fila de un producto dentro del formulario de creación de envío.
 * Muestra un selector de producto y un input de cantidad.
 * Se repite dinámicamente con useFieldArray en ShipmentsPage.
 */
export const ShipmentItemRow = ({
  index,
  products,
  register,
  errors,
  canRemove,
  onRemove,
}: ShipmentItemRowProps) => (
  <div className="flex gap-2 items-start">
    <div className="flex-1">
      <Select
        label=""
        {...register(`items.${index}.productId`)}
        error={errors.items?.[index]?.productId?.message}
        aria-label={`Producto ${index + 1}`}
        placeholder="Seleccionar producto"
        options={products.map((p) => ({ value: p.id, label: p.name }))}
      />
    </div>

    <div className="w-24">
      <Input
        label=""
        type="number"
        min={1}
        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
        error={errors.items?.[index]?.quantity?.message}
        aria-label={`Cantidad producto ${index + 1}`}
      />
    </div>

    {canRemove && (
      <button
        type="button"
        onClick={() => onRemove(index)}
        aria-label={`Eliminar producto ${index + 1}`}
        tabIndex={0}
        className="mt-1 text-red-400 hover:text-red-600 transition-colors"
      >
        <DeleteIcon size={18} />
      </button>
    )}
  </div>
);
