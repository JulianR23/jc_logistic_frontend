import * as yup from "yup";

export const warehouseSchema = yup.object({
  name: yup
    .string()
    .min(2, "Mínimo 2 caracteres")
    .required("El nombre es requerido"),
  address: yup.string().required("La dirección es requerida"),
  city: yup.string().required("La ciudad es requerida"),
  country: yup.string().optional(),
});
