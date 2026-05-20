"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader, FilterChips } from "@/components/dashboard/ui";
import { getTasks, type TaskType } from "@/lib/mock/tasks";

const CHIPS = [
  { label: "All", value: "all" },
  { label: "Read Speech", value: "read" },
  { label: "Spontaneous", value: "spontaneous" },
];

export function TaskBoard({ initialType }: { initialType: string }) {
  const [filter, setFilter] = useState(
    initialType === "read" || initialType === "spontaneous"
      ? initialType
      : "all",
  );

  const tasks = useMemo(
    () => (filter === "all" ? getTasks() : getTasks(filter as TaskType)),
    [filter],
  );

  return (
    <div className="mx-auto w-full max-w-5xl">
      <SectionHeader
        title="Task Management"
        subtitle="Complete Tasks to improve Voicer AI"
        backHref="/user"
      />

      <div className="mb-8">
        <FilterChips chips={CHIPS} value={filter} onChange={setFilter} />
      </div>

      {tasks.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No tasks for this filter yet. Check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {tasks.map((task) => (
            <article
              key={task.id}
              className="flex flex-col gap-6 rounded-3xl bg-primary p-6 text-primary-foreground shadow-glow sm:p-8"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-card px-4 py-1.5 text-sm font-semibold text-card-foreground">
                  {task.type === "read" ? "Read Speech" : "Spontaneous"}
                </span>
                <span className="text-sm italic text-primary-foreground/80">
                  {task.language}
                </span>
              </div>

              <div className="flex-1 text-center">
                <p className="text-lg font-medium sm:text-xl">{task.prompt}</p>
                {task.maxDurationSecs != null && (
                  <p className="mt-2 text-sm italic text-primary-foreground/80">
                    ~{task.maxDurationSecs} secs
                  </p>
                )}
              </div>

              <Button
                asChild
                variant="pill"
                size="pill"
                className="w-full sm:w-44 sm:self-center"
              >
                <Link href={`/user/record/${task.id}`}>Start</Link>
              </Button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
