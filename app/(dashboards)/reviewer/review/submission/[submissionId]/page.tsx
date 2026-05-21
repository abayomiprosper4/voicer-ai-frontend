import { notFound } from "next/navigation";
import { ReviewSurface } from "@/components/dashboard/ReviewSurface";
import { getSubmissionById, getNextSubmissionId } from "@/lib/mock/submissions";

// Next 16: params is a Promise — await it.
export default async function ReviewPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  const submission = getSubmissionById(submissionId);
  if (!submission) notFound();

  const nextId = getNextSubmissionId(submission.id);

  return (
    <ReviewSurface
      submission={submission}
      nextHref={nextId ? `/reviewer/review/${nextId}` : "/reviewer/queue"}
      nextLabel={nextId ? "Next submission" : "Back to queue"}
    />
  );
}
