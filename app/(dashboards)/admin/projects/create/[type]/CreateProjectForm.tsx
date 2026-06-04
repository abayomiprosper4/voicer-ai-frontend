"use client";

import { useState } from "react";
import { SectionHeader, NextArrow } from "@/components/dashboard/ui";

const TYPE_META: Record<string, { title: string; subtitle: string }> = {
  read: { title: "Read Speech", subtitle: "English" },
  spontaneous: { title: "Spontaneous Speech", subtitle: "English" },
};

export function CreateProjectForm({ type }: { type: string }) {
  const [prompt, setPrompt] = useState("");

  const meta = TYPE_META[type] ?? {
    title: "Create Project",
    subtitle: "English",
  };

  function handleAssign() {
    // TODO: wire up to API
    console.log("Assign Task:", { type, prompt });
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <SectionHeader
        title={meta.title}
        subtitle={meta.subtitle}
        backHref="/admin/projects"
      />

      {/* Main content — centered prompt area */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 sm:px-6">
        <label
          htmlFor="project-prompt"
          className="mb-4 text-center text-lg text-foreground"
        >
          Type your prompt here...
        </label>

        <textarea
          id="project-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          className="w-full resize-none rounded-2xl border-none bg-surface p-6 text-base text-surface-foreground outline-none placeholder:text-surface-foreground/60 focus:ring-2 focus:ring-ring min-h-[200px]"
        />
      </div>

      {/* Bottom bar — assign button + next arrow */}
      <div className="relative mt-8 px-4 pb-6 sm:px-6 md:pb-8">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <button
            type="button"
            onClick={handleAssign}
            disabled={!prompt.trim()}
            className="w-full rounded-full bg-cta px-12 py-4 text-lg font-semibold text-cta-foreground transition-colors hover:bg-cta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Assign Task
          </button>
        </div>

        {/* Next arrow — bottom right */}
        <div className="absolute bottom-6 right-4 sm:right-6 md:bottom-8">
          <NextArrow
            onClick={handleAssign}
            disabled={!prompt.trim()}
            label="Assign task"
          />
        </div>
      </div>
    </div>
  );
}
