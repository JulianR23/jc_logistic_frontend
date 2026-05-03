import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "../types";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
};

/**
 * Store de autenticación.
 * Persiste token y usuario en localStorage para mantener la sesión
 * entre recargas de página.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setSession: (token, user) => set({ token, user, isAuthenticated: true }),

      clearSession: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: import.meta.env.VITE_TOKEN_STORAGE_KEY || "logistica-auth" },
  ),
);
