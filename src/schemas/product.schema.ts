import * as yup from "yup";

export const productSchema = yup.object({
  name: yup
    .string()
    .min(2, "Mínimo 2 caracteres")
    .required("El nombre es requerido"),
  typeProduct: yup.string().required("El tipo de producto es requerido"),
  description: yup.string().optional(),
  sku: yup.string().required("El SKU es requerido"),
});
