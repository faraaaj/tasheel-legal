import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "gold" | "outline" | "navy" | "outlineNavy";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-navy hover:scale-[1.02] hover:bg-gold/90",
  outline: "border border-cream/25 text-cream hover:border-gold hover:text-gold",
  navy: "bg-navy text-cream hover:bg-gold hover:text-navy",
  outlineNavy:
    "border border-navy/20 text-navy hover:border-navy hover:bg-navy hover:text-cream",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5",
  md: "px-8 py-4",
};

type ButtonProps = {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

/**
 * Shared call-to-action. Renders a Next link when `href` is supplied,
 * otherwise a native button. Styling is RTL-safe via `rtl:` variants.
 */
export default function Button({
  href,
  variant = "gold",
  size = "md",
  className = "",
  children,
  type = "button",
  onClick,
  disabled,
  target,
  rel,
  ...rest
}: ButtonProps) {
  const classes = `btn group ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={classes}
        aria-label={rest["aria-label"]}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={rest["aria-label"]}
    >
      {children}
    </button>
  );
}
