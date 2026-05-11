"use client";

import { useParams } from "next/navigation";

export default function ReviewPage() {
  const params = useParams();
  const taskId = params.taskId;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Review Task {taskId}</h1>
      {/* Audio player + verdict interface */}
    </div>
  );
}
