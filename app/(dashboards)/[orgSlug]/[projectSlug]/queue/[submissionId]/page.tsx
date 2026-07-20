"use client";

import { use, useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSubmissionDetail, useSubmitReview } from "@/lib/api/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Play, Pause, Loader2, AlertCircle } from "lucide-react";

export default function ReviewDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string; submissionId: string }>;
}) {
  const { orgSlug, projectSlug, submissionId } = use(params);
  const router = useRouter();
  const basePath = `/${orgSlug}/${projectSlug}`;

  const { data: submission, isLoading, error } = useSubmissionDetail(submissionId);
  const submitReview = useSubmitReview();

  const [rating, setRating] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Audio Playback State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (submission?.audioUrl && audioRef.current) {
      audioRef.current.src = submission.audioUrl;
      audioRef.current.load();
    }
  }, [submission?.audioUrl]);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isFeedbackRequired = status === "REJECTED" || rating === "POOR";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!rating || !status) {
      setSubmitError("Please select both a rating and a status.");
      return;
    }

    if (isFeedbackRequired && !feedback.trim()) {
      setSubmitError("Feedback is required when rejecting or giving a POOR rating.");
      return;
    }

    try {
      await submitReview.mutateAsync({
        submissionId,
        rating: rating as any,
        status: status as any,
        ...(feedback.trim() ? { feedback: feedback.trim() } : {}),
      });

      router.push(`${basePath}/queue`);
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message || err.message || "Failed to submit review."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.push(`${basePath}/queue`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to queue
        </Button>
        <div className="text-center py-12">
          <AlertCircle className="h-8 w-8 mx-auto mb-3 text-destructive" />
          <p className="text-destructive">Submission not found or could not be loaded.</p>
        </div>
      </div>
    );
  }

  const contributorName = submission.contributor?.firstName 
    ? `${submission.contributor.firstName} ${submission.contributor.lastName}`
    : "Unknown User";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <audio ref={audioRef} />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`${basePath}/queue`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Review Submission</h1>
          <p className="text-muted-foreground text-sm">
            Task: {submission.task?.title || "Unknown"} · Contributor: {contributorName}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 text-sm">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-foreground">{submission.task?.instructions || submission.task?.title}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-6">
            <div className="w-full flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full shrink-0 border-primary/20 hover:bg-primary/10"
                onClick={togglePlayback}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <div className="flex-1 space-y-2">
                <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-100 ease-linear"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
            {!submission.audioUrl && (
              <p className="text-xs text-destructive">Audio URL is missing or expired.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Review Verdict</CardTitle>
            <CardDescription>Evaluate the recording against the task instructions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {submitError && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {submitError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating <span className="text-destructive">*</span></Label>
                <Select value={rating} onValueChange={(val) => setRating(val || "")} disabled={submitReview.isPending}>
                  <SelectTrigger id="rating">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXCELLENT">Excellent</SelectItem>
                    <SelectItem value="GOOD">Good</SelectItem>
                    <SelectItem value="FAIR">Fair</SelectItem>
                    <SelectItem value="POOR">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
                <Select 
                  value={rating === "POOR" ? "REJECTED" : status} 
                  onValueChange={(val) => setStatus(val || "")} 
                  disabled={submitReview.isPending || rating === "POOR"}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPROVED">Approve</SelectItem>
                    <SelectItem value="REJECTED">Reject</SelectItem>
                  </SelectContent>
                </Select>
                {rating === "POOR" && (
                  <p className="text-xs text-muted-foreground">POOR rating requires rejection.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">
                Feedback {isFeedbackRequired && <span className="text-destructive">*</span>}
              </Label>
              <Textarea
                id="feedback"
                placeholder={isFeedbackRequired ? "Please explain why this was rejected..." : "Optional feedback..."}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={submitReview.isPending}
                className="resize-none"
                rows={4}
                required={isFeedbackRequired}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-3 border-t border-border p-4 bg-muted/20">
            <Button type="button" variant="ghost" onClick={() => router.push(`${basePath}/queue`)} disabled={submitReview.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitReview.isPending}>
              {submitReview.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
