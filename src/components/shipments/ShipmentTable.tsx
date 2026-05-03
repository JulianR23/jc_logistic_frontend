import { Badge, Button } from "../ui";
import { Eye as VisibilityIcon, Trash2 as DeleteIcon } from "lucide-react";
import type { Shipment } from "../../types";

type ShipmentTableProps = {
  shipments: Shipment[];
  onViewDetail: (shipment: Shipment) => void;
  onDelete: (id: string) => void;
};

const LOGISTIC_BADGE: Record<
  string,
  { label: string; variant: "blue" | "green" }
> = {
  LAND: { label: "Terrestre", variant: "blue" },
  MARITIME: { label: "Marítimo", variant: "green" },
};

export const ShipmentTable = ({
  shipments,
  onViewDetail,
  onDelete,
}: ShipmentTableProps) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          {[
            "Guía",
            "Cliente",
            "Tipo",
            "Unidades",
            "Precio final",
            "Entrega",
            "Acciones",
          ].map((h) => (
            <th
              key={h}
              className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {shipments.map((shipment) => {
          const badge = LOGISTIC_BADGE[shipment.transportMode];
          const totalUnits = shipment.products.reduce(
            (sum, p) => sum + p.quantity,
            0,
          );
          return (
            <tr
              key={shipment.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 font-mono text-xs text-gray-600">
                {shipment.trackingNumber}
              </td>
              <td className="px-4 py-3 font-medium">
                {shipment.customer.companyName}
              </td>
              <td className="px-4 py-3">
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </td>
              <td className="px-4 py-3 text-gray-600">{totalUnits}</td>
              <td className="px-4 py-3 font-semibold text-gray-900">
                ${Number(shipment.totalCost).toLocaleString("es-CO")}
              </td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(shipment.deliveryDate).toLocaleDateString("es-CO")}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    onClick={() => onViewDetail(shipment)}
                    aria-label={`Ver detalle del envío ${shipment.trackingNumber}`}
                    tabIndex={0}
                  >
                    <VisibilityIcon size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onDelete(shipment.id)}
                    aria-label={`Eliminar envío ${shipment.trackingNumber}`}
                    tabIndex={0}
                  >
                    <DeleteIcon size={18} />
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
