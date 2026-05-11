"use client";

import { useParams } from "next/navigation";

export default function ProjectPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Manage Project {id}</h1>
      {/* Create prompts for project */}
    </div>
  );
}
