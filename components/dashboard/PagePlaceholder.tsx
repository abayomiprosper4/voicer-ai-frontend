import type { ReactNode } from "react";

/**
 * Consistent "designed soon" state for routes whose Figma frames haven't
 * arrived yet — keeps nav clickable and never shows a blank screen
 * (AGENTS.md §5). Replace each with the real screen as designs land.
 */
export function PagePlaceholder({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary">
        {icon}
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      <p className="text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
