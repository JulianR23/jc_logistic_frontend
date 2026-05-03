import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedLayout } from "../components/layout/ProtectedLayout";
import { useAuthStore } from "../store/auth.store";
import { ClientsPage, HomePage } from "../pages";
import { LoginPage } from "../pages/LoginPage";
import { PortsPage } from "../pages";
import { ProductsPage } from "../pages";
import { ShipmentsPage } from "../pages";
import { WarehousesPage } from "../pages";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
};

export const AppRouter = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <PublicGuard>
          <LoginPage />
        </PublicGuard>
      }
    />

    <Route
      element={
        <AuthGuard>
          <ProtectedLayout />
        </AuthGuard>
      }
    >
      <Route path="/dashboard" element={<HomePage />} />
      <Route path="/shipments" element={<ShipmentsPage />} />
      <Route path="/clients" element={<ClientsPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/warehouses" element={<WarehousesPage />} />
      <Route path="/ports" element={<PortsPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
