import { notFound } from "next/navigation";
import { RecorderSurface } from "@/components/dashboard/RecorderSurface";
import { getTaskById, getNextTaskId } from "@/lib/mock/tasks";

// Next 16: params is a Promise — await it.
export default async function RecordPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const task = getTaskById(taskId);
  if (!task) notFound();

  const nextId = getNextTaskId(task.id);

  return (
    <RecorderSurface
      task={task}
      nextHref={nextId ? `/user/record/${nextId}` : "/user/tasks"}
      nextLabel={nextId ? "Next task" : "Back to tasks"}
    />
  );
}
