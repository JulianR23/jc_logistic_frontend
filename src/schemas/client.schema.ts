import * as yup from "yup";

export const clientSchema = yup.object({
  companyName: yup
    .string()
    .min(2, "Mínimo 2 caracteres")
    .required("El nombre es requerido"),
  email: yup.string().email("Email inválido").required("El email es requerido"),
  phone: yup
    .string()
    .max(10, "El teléfono no puede superar 10 caracteres")
    .required("El teléfono es requerido"),
  documentId: yup
    .string()
    .max(12, "El NIT debe tener exactamente 12 caracteres")
    .required("El documento es requerido"),
});
