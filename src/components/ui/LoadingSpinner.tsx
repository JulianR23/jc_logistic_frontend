type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  message?: string;
  fullPage?: boolean;
};

const SIZE_CLASSES = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-[3px]",
};

export const LoadingSpinner = ({
  size = "lg",
  message,
  fullPage = true,
}: LoadingSpinnerProps) => (
  <div
    className={`flex flex-col items-center justify-center gap-3 ${
      fullPage ? "min-h-[60vh]" : "py-8"
    }`}
    role="status"
    aria-label={message ?? "Cargando"}
  >
    <span
      className={`${SIZE_CLASSES[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
      aria-hidden="true"
    />
    {message && <p className="text-sm text-gray-500">{message}</p>}
  </div>
);
