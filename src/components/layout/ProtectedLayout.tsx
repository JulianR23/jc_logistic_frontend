import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "../ui/ToastContainer";
import { useAuthStore } from "../../store/auth.store";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Inicio" },
  { to: "/shipments", label: "Envíos" },
  { to: "/clients", label: "Clientes" },
  { to: "/products", label: "Productos" },
  { to: "/warehouses", label: "Bodegas" },
  { to: "/ports", label: "Puertos" },
];

// ── ProtectedLayout ───────────────────────────────────────────────────────────

export const ProtectedLayout = () => {
  const { user, clearSession } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className="w-56 bg-white border-r border-gray-200 flex flex-col"
        aria-label="Navegación principal"
      >
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-base font-bold text-blue-600">Logística</h1>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{user?.name}</p>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              tabIndex={0}
              aria-label={label}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            tabIndex={0}
            aria-label="Cerrar sesión"
            className="w-full px-3 py-2 text-sm text-left text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>

      <ToastContainer />
    </div>
  );
};
