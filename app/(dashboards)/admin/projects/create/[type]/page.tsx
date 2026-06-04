import { CreateProjectForm } from "./CreateProjectForm";

export default async function CreateProjectPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  return <CreateProjectForm type={type} />;
}
