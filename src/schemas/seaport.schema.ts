import * as yup from "yup";

export const seaportSchema = yup.object({
  name: yup
    .string()
    .min(2, "Mínimo 2 caracteres")
    .required("El nombre es requerido"),
  city: yup.string().required("La ciudad es requerida"),
  country: yup.string().required("El país es requerido"),
  address: yup.string().required("La dirección es requerida"),
});
