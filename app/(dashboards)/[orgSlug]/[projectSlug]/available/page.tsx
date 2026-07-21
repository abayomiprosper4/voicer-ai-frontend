"use client";
import { LogoLoader } from "@/components/ui/logo-loader";
import { use } from "react";
import Link from "next/link";
import { useAvailableTasks } from "@/lib/api/queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {  FileAudio, PlayCircle, Settings2, ArrowRight, ListChecks } from "lucide-react";

export default function AvailableTasksPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string }>;
}) {
  const { orgSlug, projectSlug } = use(params);
  const { data: tasks, isLoading, error } = useAvailableTasks(projectSlug);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <LogoLoader className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Failed to load available tasks.</p>
      </div>
    );
  }

  const hasTasks = tasks && tasks.length > 0;

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "READ_PROMPT":
        return <FileAudio className="h-5 w-5" />;
      case "SPONTANEOUS_SPEECH":
        return <PlayCircle className="h-5 w-5" />;
      case "GUIDED_CONVERSATION":
        return <Settings2 className="h-5 w-5" />;
      default:
        return <FileAudio className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Available Tasks</h1>
        <p className="text-muted-foreground mt-1">Recording tasks matched to your language proficiencies.</p>
      </div>

      {!hasTasks ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-muted/20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <ListChecks className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No tasks available</h2>
          <p className="text-muted-foreground max-w-sm">
            There are currently no tasks that match your language proficiencies. Check your account settings to update your languages.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task: any) => (
            <Link key={task.id} href={`/${orgSlug}/${projectSlug}/record/${task.id}`}>
              <Card className="hover:border-foreground/50 transition-colors cursor-pointer h-full group flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted group-hover:bg-foreground group-hover:text-background transition-colors">
                      {getTaskIcon(task.taskType)}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                  <CardTitle className="mt-4">{task.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {task.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 font-semibold text-muted-foreground bg-muted/50">
                      {task.languageId?.substring(0, 8) || "Unknown"}
                    </span>
                    {task.targetDuration && (
                      <span className="font-mono text-muted-foreground">
                        Target: {task.targetDuration}s
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
