import { ComponentProps } from "react";
import { cn } from "../utils";

const sizeClasses = {
  regular: "py-[0.6rem]",
  large: "py-4",
};

const variantClasses = {
  primary: "bg-black text-white",
  secondary: "bg-theme-grey-3 text-theme-black",
};

type ButtonVariant = keyof typeof variantClasses;
type ButtonSize = keyof typeof sizeClasses;

export function Button({
  children,
  size = "regular",
  variant = "primary",
  fullWidth = false,
  ...props
}: ComponentProps<"button"> & {
  fullWidth?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={cn(
        "font-theme-2 px-8 py-4 text-xl font-bold tracking-wide uppercase hover:cursor-pointer disabled:opacity-60",
        fullWidth && "w-full",
        sizeClasses[size],
        variantClasses[variant],
      )}
      {...props}
    >
      {children}
    </button>
  );
}
