import type {
  UseFieldArrayRemove,
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
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
  watch: UseFormWatch<ShipmentForm>;
  errors: FieldErrors<ShipmentForm>;
  canRemove: boolean;
  onRemove: UseFieldArrayRemove;
};

export const ShipmentItemRow = ({
  index,
  products,
  register,
  watch,
  errors,
  canRemove,
  onRemove,
}: ShipmentItemRowProps) => {
  const quantity = watch(`items.${index}.quantity`) ?? 0;
  const unitPrice = watch(`items.${index}.unitPrice`) ?? 0;
  const subtotal = quantity * unitPrice;

  return (
    <div className="flex flex-col gap-1 p-2 bg-gray-50 rounded-lg border border-gray-100">
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
            placeholder="Cant."
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
            error={errors.items?.[index]?.quantity?.message}
            aria-label={`Cantidad producto ${index + 1}`}
          />
        </div>

        <div className="w-32">
          <Input
            label=""
            type="number"
            min={0.01}
            step="0.01"
            placeholder="Precio unit."
            {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
            error={errors.items?.[index]?.unitPrice?.message}
            aria-label={`Precio unitario producto ${index + 1}`}
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

      {subtotal > 0 && (
        <p className="text-xs text-gray-500 text-right pr-1">
          Subtotal:{" "}
          <span className="font-semibold text-gray-700">
            ${subtotal.toLocaleString("es-CO")}
          </span>
        </p>
      )}
    </div>
  );
};
