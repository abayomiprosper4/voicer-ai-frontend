
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader, NextArrow } from "@/components/dashboard/ui";
import { CircularPlayer } from "@/components/dashboard/CircularPlayer";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const isRead = type === "read";
  const title = isRead ? "Read Speech" : "Spontaneous Speech";

  // Mock audio URL
  const mockAudioUrl =
    "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <SectionHeader
        title="Start Listening"
        subtitle={title}
        backHref="/reviewer/project"
        italicSubtitle={true}
      />

      <div className="mb-12 text-center">
        <h2 className="mb-8 text-xl font-semibold text-foreground">
          {isRead ? "Read Speech" : "Spontaneous Speech"}
        </h2>

        <div className="mb-8 flex flex-col items-center gap-8">
          <CircularPlayer src={mockAudioUrl} fallbackSecs={150} />
          <p className="text-sm text-muted-foreground">
            Listen to the audio submission
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          asChild
          variant="default"
          size="xl"
          className="w-full max-w-md"
        >
          <Link href={`/reviewer/project/${type}/review`}>Review</Link>
        </Button>
      </div>

      <div className="mt-6 flex justify-end">
        <NextArrow href={`/reviewer/project/${type}/review`} label="Next" />
      </div>
    </div>
  );
}