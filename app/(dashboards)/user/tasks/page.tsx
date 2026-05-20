import { TaskBoard } from "@/components/dashboard/TaskBoard";

// Next 16: searchParams is a Promise — await it (used to pre-filter via the
// ?type= link from Select Project).
export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  return <TaskBoard initialType={type ?? "all"} />;
}
