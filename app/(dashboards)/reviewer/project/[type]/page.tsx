import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/dashboard/ui";
import { getTasks, type TaskType } from "@/lib/mock/tasks";

export default async function ProjectTasksPage({ params }: { params: { type: string } }) {
  const { type } = params;
  const tasks = getTasks(type as TaskType);

  const title = type === "read" ? "Read Speech" : "Spontaneous Speech";

  return (
    <div className="mx-auto w-full max-w-6xl">
      <SectionHeader
        title={title}
        subtitle={`All ${title} tasks`}
        backHref="/reviewer/project"
        italicSubtitle
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="px-6 py-4 text-left text-sm font-semibold text-surface-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-surface-foreground">Language</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-surface-foreground">Date submitted</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-surface-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-border hover:bg-surface/30 transition-colors">
                <td className="px-6 py-4 text-sm text-foreground">{task.id ?? `Speaker ${task.id}`}</td>
                <td className="px-6 py-4 text-sm text-foreground">{task.language}</td>
                <td className="px-6 py-4 text-sm text-foreground">{task.dateSubmitted}</td>
                <td className="px-6 py-4 text-sm">
                  <Button asChild variant="default" size="sm" className="h-8">
                    <Link href={`/reviewer/project/${type}/review/${task.id}`}>Review</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}