import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Email inválido").required("El email es requerido"),
  password: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("La contraseña es requerida"),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, "Mínimo 2 caracteres")
    .required("El nombre es requerido"),
  email: yup.string().email("Email inválido").required("El email es requerido"),
  phone: yup
    .string()
    .max(10, "El teléfono no puede tener más de 10 caracteres")
    .required("El teléfono es requerido"),
  nit: yup
    .string()
    .max(12, "El NIT no puede tener más de 12 caracteres")
    .required("El NIT es requerido"),
  password: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("La contraseña es requerida"),
});
