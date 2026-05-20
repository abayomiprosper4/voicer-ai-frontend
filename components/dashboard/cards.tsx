import { cn } from "@/lib/utils";
import type { Submission } from "@/lib/mock/submissions";

/** Outlined stat pill — "12 Submissions", "8 Approved", … */
export function StatChip({ label }: { label: string }) {
  return (
    <div className="rounded-full border border-border px-5 py-2.5 text-center text-sm font-medium text-primary">
      {label}
    </div>
  );
}

/**
 * Submission card (My Submissions + Dashboard recent). Muted teal panel with
 * dark text, dark type label, status + timestamp footer. Faithful to Figma:
 * every status uses the teal accent + dot.
 */
export function SubmissionCard({ submission }: { submission: Submission }) {
  const { type, language, prompt, durationSecs, status, when } = submission;
  return (
    <article className="flex flex-col gap-5 rounded-3xl bg-panel p-6 text-panel-foreground sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-md bg-cta px-3 py-1.5 text-sm font-semibold text-cta-foreground">
          {type === "read" ? "Read Speech" : "Spontaneous"}
        </span>
        <span className="text-sm italic text-panel-foreground/70">
          {language}
        </span>
      </div>

      <div className="flex-1 text-center">
        <p className="text-lg font-medium">{prompt}</p>
        <p className="mt-1 text-sm italic text-panel-foreground/70">
          ~{durationSecs} secs
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 font-medium text-primary">
          <span
            className={cn("h-2.5 w-2.5 rounded-full bg-primary")}
            aria-hidden
          />
          <span className="capitalize">{status}</span>
        </span>
        <span className="italic text-panel-foreground/60">{when}</span>
      </div>
    </article>
  );
}
