export const QUERY_KEYS = {
  clients: ["clients"] as const,
  products: ["products"] as const,
  warehouses: ["warehouses"] as const,
  ports: ["ports"] as const,
  shipments: ["shipments"] as const,
  shipmentsByClient: (clientId: string) =>
    ["shipments", "client", clientId] as const,
  nextTrackingNumber: ["shipments", "next-tracking-number"] as const,
};
