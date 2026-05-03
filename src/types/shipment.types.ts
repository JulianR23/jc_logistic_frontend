import type { Client } from "./client.types";
import type { Port } from "./seaport";
import type { Warehouse } from "./warehouse.types";

export type ShipmentProductItem = {
  shipmentId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    typeProduct: string;
    description: string | null;
    sku: string;
  };
  quantity: number;
  weight: string | null;
  volume: string | null;
};

export type Shipment = {
  id: string;
  customerId: string;
  customer: Client;
  trackingNumber: string;
  createdAt: string;
  updatedAt: string;
  deliveryDate: string;
  basePrice: string;
  discountValue: string;
  totalCost: string;
  transportMode: string;
  status: string;
  land: {
    shipmentId: string;
    warehouseId: string;
    warehouse: Warehouse;
    licensePlate: string;
  } | null;
  maritime: {
    shipmentId: string;
    seaPortId: string;
    seaPort: Port;
    fleetNumber: string;
  } | null;
  products: ShipmentProductItem[];
};
