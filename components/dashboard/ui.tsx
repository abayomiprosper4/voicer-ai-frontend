"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared contributor-flow primitives, faithful to the Figma frames.
 * All colors via tokens; every control has hover + focus-visible states.
 */

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Top-left back arrow. Uses an explicit href when given, else history back. */
export function BackButton({
  href,
  className,
}: {
  href?: string;
  className?: string;
}) {
  const router = useRouter();
  const cls = cn(
    "inline-flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-secondary",
    focusRing,
    className,
  );
  if (href) {
    return (
      <Link href={href} aria-label="Go back" className={cls}>
        <ArrowLeft className="h-6 w-6" />
      </Link>
    );
  }
  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={() => router.back()}
      className={cls}
    >
      <ArrowLeft className="h-6 w-6" />
    </button>
  );
}

/** Bottom-right next/forward arrow. Disabled when there is no destination. */
export function NextArrow({
  href,
  onClick,
  disabled,
  label = "Next",
  className,
}: {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  const cls = cn(
    "inline-flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-40",
    focusRing,
    className,
  );
  if (href && !disabled) {
    return (
      <Link href={href} aria-label={label} className={cls}>
        <ArrowRight className="h-6 w-6" />
      </Link>
    );
  }
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cls}
    >
      <ArrowRight className="h-6 w-6" />
    </button>
  );
}

/**
 * Centered page header: back arrow on the left, title centered, optional
 * italic muted subtitle below (e.g. the task language).
 */
export function SectionHeader({
  title,
  subtitle,
  backHref,
  italicSubtitle = true,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  italicSubtitle?: boolean;
}) {
  return (
    <header className="relative mb-8 sm:mb-10">
      <div className="absolute left-0 top-0">
        <BackButton href={backHref} />
      </div>
      <div className="px-12 text-center sm:px-14">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              "mt-2 text-base text-muted-foreground sm:text-lg",
              italicSubtitle && "italic",
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}

export type FilterChip = { label: string; value: string };

/** Single-select chip row (All / Read Speech / Spontaneous). */
export function FilterChips({
  chips,
  value,
  onChange,
}: {
  chips: FilterChip[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter tasks"
      className="flex flex-wrap justify-center gap-3"
    >
      {chips.map((chip) => {
        const selected = chip.value === value;
        return (
          <button
            key={chip.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(chip.value)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              focusRing,
              selected
                ? "bg-primary/15 text-primary"
                : "bg-secondary text-primary hover:bg-primary/10",
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}

/** Large teal brand container that holds white pill actions. */
export function BrandCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-primary p-6 text-primary-foreground shadow-glow sm:p-8 md:p-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
