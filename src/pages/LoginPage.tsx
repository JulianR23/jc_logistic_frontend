import { yupResolver } from "@hookform/resolvers/yup";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Button, Input, ToastContainer } from "../components/ui";
import { authService } from "../services";
import { loginSchema, registerSchema } from "../schemas";
import { useAuthStore } from "../store/auth.store";
import { useUiStore } from "../store/ui.store";

type LoginFormData = yup.InferType<typeof loginSchema>;
type RegisterFormData = yup.InferType<typeof registerSchema>;

type ApiErrorBody = { message?: string; statusCode?: number };

const getLoginErrorMessage = (err: unknown): string => {
  const status = (err as AxiosError<ApiErrorBody>).response?.status;
  if (status === 401 || status === 403) return "Contraseña incorrecta.";
  if (status === 404) return "No existe una cuenta con ese email.";
  return "Credenciales inválidas. Verifica tu email y contraseña.";
};

export const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const { setSession } = useAuthStore();
  const { showToast } = useUiStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("session_expired")) {
      localStorage.removeItem("session_expired");
      showToast("Tu sesión ha expirado. Por favor inicia sesión de nuevo.", "warning");
    }
  }, [showToast]);

  const loginForm = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });
  const registerForm = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data.email, data.password);
      setSession(response.accessToken, response.user);
      showToast("Sesión iniciada correctamente", "success");
      navigate("/home");
    } catch (err) {
      showToast(getLoginErrorMessage(err), "error");
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      const response = await authService.register(
        data.name,
        data.email,
        data.password,
      );
      setSession(response.accessToken, response.user);
      showToast("Cuenta creada exitosamente", "success");
      navigate("/home");
    } catch (err) {
      const status = (err as AxiosError<ApiErrorBody>).response?.status;
      if (status === 409) {
        showToast("El email ya está registrado.", "warning");
      } else {
        showToast("Error al crear la cuenta. Intenta de nuevo.", "error");
      }
    }
  };

  const switchMode = () => {
    loginForm.reset();
    registerForm.reset();
    setIsRegister((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-1">Logística</h1>
          <h2 className="text-xl font-bold text-gray-900">
            Sistema de Logística
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {isRegister ? "Crear cuenta nueva" : "Iniciar sesión"}
          </p>
        </div>

        {isRegister ? (
          <form
            onSubmit={registerForm.handleSubmit(handleRegister)}
            className="flex flex-col gap-4"
            noValidate
          >
            <Input
              label="Nombre completo"
              placeholder="Juan Pérez"
              aria-label="Nombre completo"
              {...registerForm.register("name")}
              error={registerForm.formState.errors.name?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="usuario@email.com"
              aria-label="Email"
              {...registerForm.register("email")}
              error={registerForm.formState.errors.email?.message}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••"
              aria-label="Contraseña"
              {...registerForm.register("password")}
              error={registerForm.formState.errors.password?.message}
            />
            <Button
              type="submit"
              isLoading={registerForm.formState.isSubmitting}
              className="mt-2 w-full"
            >
              Crear cuenta
            </Button>
          </form>
        ) : (
          <form
            onSubmit={loginForm.handleSubmit(handleLogin)}
            className="flex flex-col gap-4"
            noValidate
          >
            <Input
              label="Email"
              type="email"
              placeholder="usuario@email.com"
              aria-label="Email"
              {...loginForm.register("email")}
              error={loginForm.formState.errors.email?.message}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••"
              aria-label="Contraseña"
              {...loginForm.register("password")}
              error={loginForm.formState.errors.password?.message}
            />
            <Button
              type="submit"
              isLoading={loginForm.formState.isSubmitting}
              className="mt-2 w-full"
            >
              Iniciar sesión
            </Button>
          </form>
        )}

        <button
          onClick={switchMode}
          tabIndex={0}
          aria-label={isRegister ? "Ir a iniciar sesión" : "Ir a registro"}
          className="mt-6 w-full text-center text-sm text-blue-600 hover:underline"
        >
          {isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};
