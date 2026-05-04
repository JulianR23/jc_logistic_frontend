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
  password: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("La contraseña es requerida"),
});
