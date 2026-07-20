"use client";

import { use, useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTaskDetail, useRequestUploadUrl, useCreateSubmission } from "@/lib/api/queries";
import { useAudioRecorder, getBaseMimeType } from "@/hooks/useAudioRecorder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Mic, Square, Play, Pause, RotateCcw, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type UploadStep = "idle" | "requesting-url" | "uploading" | "finalizing" | "done" | "error";

export default function RecordTaskPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string; taskId: string }>;
}) {
  const { orgSlug, projectSlug, taskId } = use(params);
  const router = useRouter();
  const basePath = `/${orgSlug}/${projectSlug}`;

  // --- Data Fetching ---
  const { data: task, isLoading: taskLoading, error: taskError } = useTaskDetail(taskId);

  // --- Audio Recording ---
  const {
    status: recorderStatus,
    startRecording,
    stopRecording,
    audioBlob,
    audioDuration,
    audioUrl,
    mimeType,
    reset: resetRecorder,
    error: recorderError,
  } = useAudioRecorder();

  // --- Upload Pipeline ---
  const requestUploadUrl = useRequestUploadUrl();
  const createSubmission = useCreateSubmission();

  const [uploadStep, setUploadStep] = useState<UploadStep>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);

  // --- Audio Playback & Memory Cleanup ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Reset playing state when audio ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  // --- Format helpers ---
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getFileExtension = (mime: string) => {
    const base = getBaseMimeType(mime);
    const map: Record<string, string> = {
      "audio/webm": "webm",
      "audio/mp4": "mp4",
      "audio/ogg": "ogg",
      "audio/wav": "wav",
      "audio/mpeg": "mp3",
    };
    return map[base] || "webm";
  };

  // --- 3-Step Upload Pipeline ---
  const handleSubmit = async () => {
    if (!audioBlob || !task) return;

    setUploadError(null);

    try {
      // Step 1: Request signed URL
      setUploadStep("requesting-url");
      const baseMime = getBaseMimeType(mimeType) as any;
      const ext = getFileExtension(mimeType);
      const fileName = `recording.${ext}`;

      const urlResult = await requestUploadUrl.mutateAsync({
        taskId,
        fileName,
        mimeType: baseMime,
      });

      if (!urlResult?.uploadUrl || !urlResult?.storagePath) {
        throw new Error("Server did not return a valid upload URL.");
      }

      // Step 2: PUT file directly to Supabase Storage
      setUploadStep("uploading");
      abortControllerRef.current = new AbortController();
      
      const uploadResponse = await fetch(urlResult.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": baseMime,
        },
        body: audioBlob,
        signal: abortControllerRef.current.signal,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status ${uploadResponse.status}. Please try again.`);
      }

      // Step 3: Finalize submission record
      setUploadStep("finalizing");

      // Get parentId from URL search params (for resubmissions)
      const searchParams = new URLSearchParams(window.location.search);
      const parentId = searchParams.get("parentId") || undefined;

      await createSubmission.mutateAsync({
        taskId,
        storagePath: urlResult.storagePath,
        languageId: task.languageId,
        audioDuration,
        fileSize: audioBlob.size,
        ...(parentId ? { parentId } : {}),
      });

      setUploadStep("done");

      // Navigate to submissions after a brief delay so user sees the success state
      timeoutRef.current = setTimeout(() => {
        router.push(`${basePath}/submissions`);
      }, 1500);
    } catch (err: any) {
      if (err.name === "AbortError") return;
      
      setUploadStep("error");
      setUploadError(
        err?.response?.data?.message ||
        err?.message ||
        "An unexpected error occurred. Please try again."
      );
    }
  };

  // --- Loading & Error States ---
  if (taskLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (taskError || !task) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.push(`${basePath}/available`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to tasks
        </Button>
        <div className="text-center py-12">
          <AlertCircle className="h-8 w-8 mx-auto mb-3 text-destructive" />
          <p className="text-destructive">Task not found or could not be loaded.</p>
        </div>
      </div>
    );
  }

  const isUploading = uploadStep !== "idle" && uploadStep !== "done" && uploadStep !== "error";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} />

      {/* Back Button + Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`${basePath}/available`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>
          <p className="text-muted-foreground text-sm italic">
            {task.taskType === "READ_PROMPT" ? "Read Prompt" :
             task.taskType === "SPONTANEOUS_SPEECH" ? "Spontaneous Speech" : "Guided Conversation"}
            {task.targetDuration && ` · Target: ${task.targetDuration}s`}
          </p>
        </div>
      </div>

      {/* Task Prompt / Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Instructions</CardTitle>
          <CardDescription>
            {task.description || "Follow the prompt below."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-6 text-center text-lg font-medium text-foreground leading-relaxed">
            {task.instructions || task.title}
          </div>
        </CardContent>
      </Card>

      {/* Recording Interface */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 sm:p-12 space-y-8">
          {/* Timer */}
          <div className="text-5xl font-mono tracking-wider text-foreground tabular-nums">
            {formatTime(audioDuration)}
          </div>

          {/* Recording Error */}
          {recorderError && (
            <div className="flex items-center gap-2 text-destructive text-sm text-center max-w-md">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {recorderError}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4">
            {recorderStatus === "idle" && (
              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                onClick={startRecording}
                disabled={isUploading}
              >
                <Mic className="h-6 w-6" />
              </Button>
            )}

            {recorderStatus === "recording" && (
              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse"
                onClick={stopRecording}
              >
                <Square className="h-6 w-6" />
              </Button>
            )}

            {recorderStatus === "recorded" && (
              <>
                {/* Playback */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={togglePlayback}
                  disabled={isUploading}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                {/* Re-record */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={resetRecorder}
                  disabled={isUploading}
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>

          {/* Status Text */}
          <p className="text-sm text-muted-foreground">
            {recorderStatus === "idle" && "Tap the microphone to start recording."}
            {recorderStatus === "recording" && "Recording... Tap the square to stop."}
            {recorderStatus === "recorded" && !isUploading && "Review your recording, then submit."}
            {uploadStep === "requesting-url" && "Preparing upload..."}
            {uploadStep === "uploading" && "Uploading audio..."}
            {uploadStep === "finalizing" && "Saving submission..."}
          </p>
        </CardContent>

        {/* Submit / Success / Error Footer */}
        {recorderStatus === "recorded" && (
          <CardFooter className="justify-center border-t border-border p-4 flex-col gap-3">
            {uploadStep === "done" ? (
              <div className="flex items-center gap-2 text-emerald-500 font-medium">
                <CheckCircle2 className="h-5 w-5" />
                Submission successful! Redirecting...
              </div>
            ) : uploadStep === "error" ? (
              <>
                <div className="flex items-center gap-2 text-destructive text-sm text-center">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {uploadError}
                </div>
                <Button onClick={handleSubmit} className="w-full sm:w-auto gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Retry Upload
                </Button>
              </>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isUploading}
                className="w-full sm:w-auto gap-2"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isUploading ? "Submitting..." : "Submit Recording"}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
