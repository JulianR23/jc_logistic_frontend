import * as yup from "yup";

const shipmentItemSchema = yup.object({
  productId: yup.string().required("El producto es requerido"),
  quantity: yup
    .number()
    .integer("Debe ser un número entero")
    .min(1, "Mínimo 1 unidad")
    .required("La cantidad es requerida"),
  unitPrice: yup
    .number()
    .positive("Debe ser mayor que 0")
    .required("El precio unitario es requerido"),
});

export const shipmentSchema = yup.object({
  guideNumber: yup
    .string()
    .optional()
    .matches(
      /^[A-Z0-9]{10}$/,
      "Debe tener 10 caracteres alfanuméricos en mayúsculas",
    ),

  logisticType: yup
    .string()
    .oneOf(["LAND", "MARITIME"], "Tipo inválido")
    .required("El tipo de logística es requerido"),

  clientId: yup.string().required("El cliente es requerido"),

  deliveryAt: yup
    .string()
    .required("La fecha de entrega es requerida")
    .test(
      "min-today",
      "La fecha de entrega no puede ser anterior al día de hoy",
      (value) => {
        if (!value) return false;
        // Evitar problemas de zona horaria extrayendo solo YYYY-MM-DD
        const dateString = value.split("T")[0];
        const valDate = new Date(dateString + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return valDate >= today;
      },
    ),

  items: yup
    .array(shipmentItemSchema)
    .min(1, "Debe agregar al menos un producto")
    .required(),

  // ── Campos exclusivos TERRESTRIAL ─────────────────────────────────────────
  vehiclePlate: yup.string().when("logisticType", {
    is: "LAND",
    then: (s) =>
      s
        .matches(/^[A-Z]{3}\d{3}$/, "Formato inválido. Ejemplo: AAA123")
        .required("La placa es requerida para logística terrestre"),
    otherwise: (s) => s.optional(),
  }),

  warehouseId: yup.string().when("logisticType", {
    is: "LAND",
    then: (s) => s.required("La bodega es requerida para logística terrestre"),
    otherwise: (s) => s.optional(),
  }),

  // ── Campos exclusivos MARITIME ────────────────────────────────────────────
  fleetNumber: yup.string().when("logisticType", {
    is: "MARITIME",
    then: (s) =>
      s
        .matches(/^[A-Z]{3}\d{4}[A-Z]$/, "Formato inválido. Ejemplo: AAA1234A")
        .required("El número de flota es requerido para logística marítima"),
    otherwise: (s) => s.optional(),
  }),

  portId: yup.string().when("logisticType", {
    is: "MARITIME",
    then: (s) => s.required("El puerto es requerido para logística marítima"),
    otherwise: (s) => s.optional(),
  }),
});
