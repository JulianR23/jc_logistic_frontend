type BadgeVariant = "blue" | "green" | "yellow" | "red" | "gray";

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  gray: "bg-gray-100 text-gray-600",
};

export const Badge = ({
  children,
  variant = "gray",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${BADGE_VARIANTS[variant]}`}
  >
    {children}
  </span>
);
