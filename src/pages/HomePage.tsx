import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { useShipments } from "../hooks/useShipments";
import { useClients } from "../hooks/useClients";
import { useProducts } from "../hooks/useProducts";
import { useWarehouses } from "../hooks/useWarehouses";
import { usePorts } from "../hooks/usePorts";

type StatCardProps = {
  label: string;
  icon: string;
  count: number | undefined;
  isLoading: boolean;
  to: string;
};

const StatCard = ({ label, icon, count, isLoading, to }: StatCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-5 hover:border-blue-300 hover:shadow-md transition-all text-left w-full"
    >
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        {isLoading ? (
          <div className="h-7 w-10 bg-gray-100 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-2xl font-bold text-gray-800">{count ?? 0}</p>
        )}
      </div>
    </button>
  );
};

const QUICK_LINKS = [
  { to: "/shipments", icon: "", label: "Ver Envíos" },
  { to: "/clients", icon: "", label: "Ver Clientes" },
  { to: "/products", icon: "", label: "Ver Productos" },
  { to: "/warehouses", icon: "", label: "Ver Bodegas" },
  { to: "/ports", icon: "", label: "Ver Puertos" },
];

export const HomePage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: shipments, isLoading: loadingShipments } = useShipments();
  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: warehouses, isLoading: loadingWarehouses } = useWarehouses();
  const { data: ports, isLoading: loadingPorts } = usePorts();

  const terrestrialCount = shipments?.filter(
    (s) => s.transportMode === "LAND",
  ).length;
  const maritimeCount = shipments?.filter(
    (s) => s.transportMode === "MARITIME",
  ).length;

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Bienvenido, {user?.name ?? "usuario"}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Aquí tienes un resumen del estado actual de la plataforma.
        </p>
      </div>

      {/* Stats */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Resumen general
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            label="Envíos"
            icon=""
            count={shipments?.length}
            isLoading={loadingShipments}
            to="/shipments"
          />
          <StatCard
            label="Clientes"
            icon=""
            count={clients?.length}
            isLoading={loadingClients}
            to="/clients"
          />
          <StatCard
            label="Productos"
            icon=""
            count={products?.length}
            isLoading={loadingProducts}
            to="/products"
          />
          <StatCard
            label="Bodegas"
            icon=""
            count={warehouses?.length}
            isLoading={loadingWarehouses}
            to="/warehouses"
          />
          <StatCard
            label="Puertos"
            icon=""
            count={ports?.length}
            isLoading={loadingPorts}
            to="/ports"
          />
        </div>
      </section>

      {/* Shipment breakdown */}
      {!loadingShipments && shipments && shipments.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Envíos por tipo
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
              <span className="text-2xl"></span>
              <div>
                <p className="text-xs text-gray-400">Terrestres</p>
                <p className="text-xl font-bold text-gray-800">
                  {terrestrialCount ?? 0}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
              <span className="text-2xl"></span>
              <div>
                <p className="text-xs text-gray-400">Marítimos</p>
                <p className="text-xl font-bold text-gray-800">
                  {maritimeCount ?? 0}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick links */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Accesos rápidos
        </h2>
        <div className="flex flex-wrap gap-2">
          {QUICK_LINKS.map(({ to, icon, label }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            >
              {icon && <span>{icon}</span>}
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
