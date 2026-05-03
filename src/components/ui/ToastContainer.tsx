import type { ReactElement } from "react";
import { useUiStore } from "../../store/ui.store";
import type { ToastType } from "../../store/ui.store";
import {
  CheckCircle as CheckCircleIcon,
  XCircle as ErrorIcon,
  Info as InfoIcon,
  AlertTriangle as WarningIcon,
  X as CloseIcon,
} from "lucide-react";

const TOAST_STYLES: Record<ToastType, string> = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-blue-600",
  warning: "bg-amber-500",
};

const TOAST_ICONS: Record<ToastType, ReactElement> = {
  success: <CheckCircleIcon size={18} />,
  error: <ErrorIcon size={18} />,
  info: <InfoIcon size={18} />,
  warning: <WarningIcon size={18} />,
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useUiStore();

  return (
    <div
      className="fixed top-4 left-4 z-50 flex flex-col gap-2"
      aria-live="polite"
      aria-label="Notificaciones"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white text-sm shadow-lg min-w-64 max-w-sm ${TOAST_STYLES[toast.type]}`}
        >
          <span className="font-bold text-base leading-none">
            {TOAST_ICONS[toast.type]}
          </span>
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            aria-label="Cerrar notificación"
            className="opacity-75 hover:opacity-100 ml-1 shrink-0"
          >
            <CloseIcon size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};
