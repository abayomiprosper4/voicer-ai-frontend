"use client";

import { useParams } from "next/navigation";

export default function RecordPage() {
  const params = useParams();
  const taskId = params.taskId;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Record Task {taskId}</h1>
      {/* Mic + Playback recording interface */}
    </div>
  );
}
