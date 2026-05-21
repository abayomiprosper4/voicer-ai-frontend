"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Mic,
  Upload,
  Play,
  Pause,
  Square,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader, NextArrow } from "@/components/dashboard/ui";
import { CircularPlayer } from "@/components/dashboard/CircularPlayer";
import type { Task } from "@/lib/mock/tasks";

/**
 * Recorder for both task variants (PRD §8.3 · C-3 / C-4).
 *
 * Real in-browser capture via MediaRecorder + Web Audio for the live
 * waveform. Upload/submit is STUBBED until the API exists (PRD §8.4) — it
 * resolves locally so the whole flow (Playback → Submitting → Submitted) is
 * testable.
 *
 * States: idle → recording ⇄ paused → recorded(Playback) → submitting →
 *         submitted. error is reachable from idle if mic permission fails.
 *
 * Owns the page header so the title can track the state ("Speak about this"
 * → "Playback" → "Submitting").
 */

type State =
  | "idle"
  | "recording"
  | "paused"
  | "recorded"
  | "submitting"
  | "submitted"
  | "error";

const BARS = 28;

function fmt(total: number) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function RecorderSurface({
  task,
  nextHref,
  nextLabel,
}: {
  task: Task;
  nextHref: string;
  nextLabel: string;
}) {
  const isRead = task.type === "read";
  const max = task.maxDurationSecs;

  const [state, setState] = useState<State>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [levels, setLevels] = useState<number[]>(() =>
    new Array(BARS).fill(0.12),
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blobRef = useRef<Blob | null>(null);

  const stopMeters = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    rafRef.current = null;
    timerRef.current = null;
  }, []);

  const teardown = useCallback(() => {
    stopMeters();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;
    mediaRef.current = null;
  }, [stopMeters]);

  useEffect(() => {
    return () => {
      teardown();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawLoop = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const buf = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(buf);
      const next: number[] = [];
      const step = Math.floor(buf.length / BARS) || 1;
      for (let i = 0; i < BARS; i++) {
        next.push(Math.max(0.12, buf[i * step] / 255));
      }
      setLevels(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setElapsed((e) => {
        const n = e + 1;
        if (max && n >= max) {
          queueMicrotask(() => stopRecording());
          return max;
        }
        return n;
      });
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [max]);

  async function startRecording() {
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;

      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mr.mimeType || "audio/webm",
        });
        blobRef.current = blob;
        setAudioUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
      };
      mediaRef.current = mr;
      mr.start();

      setElapsed(0);
      setState("recording");
      startTimer();
      drawLoop();
    } catch (err) {
      teardown();
      const msg =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Microphone access was denied. Allow it in your browser to record."
          : err instanceof DOMException && err.name === "NotFoundError"
            ? "No microphone was found on this device."
            : "Could not start recording. Check your microphone and try again.";
      setErrorMsg(msg);
      setState("error");
    }
  }

  function pauseRecording() {
    const mr = mediaRef.current;
    if (mr && mr.state === "recording") {
      mr.pause();
      stopMeters();
      setState("paused");
    }
  }

  function resumeRecording() {
    const mr = mediaRef.current;
    if (mr && mr.state === "paused") {
      mr.resume();
      setState("recording");
      startTimer();
      drawLoop();
    }
  }

  function stopRecording() {
    const mr = mediaRef.current;
    if (mr && mr.state !== "inactive") mr.stop();
    teardown();
    setState("recorded");
    setLevels(new Array(BARS).fill(0.12));
  }

  function reset() {
    teardown();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    blobRef.current = null;
    setElapsed(0);
    setLevels(new Array(BARS).fill(0.12));
    setState("idle");
    setErrorMsg("");
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    blobRef.current = file;
    setAudioUrl(URL.createObjectURL(file));
    setElapsed(0);
    setState("recorded");
  }

  async function submit() {
    setState("submitting");
    // STUB: real upload → POST /submit-audio (PRD §8.4) lands later.
    await new Promise((r) => setTimeout(r, 1600));
    // eslint-disable-next-line no-console
    console.log("[stub] submit", {
      taskId: task.id,
      bytes: blobRef.current?.size ?? 0,
      seconds: elapsed,
    });
    setState("submitted");
  }

  const recording = state === "recording";
  const paused = state === "paused";
  const remaining = max != null ? Math.max(0, max - elapsed) : null;

  const baseTitle = isRead ? "Read this Sentence" : "Speak about this";
  const title =
    state === "recorded" || state === "submitted"
      ? "Playback"
      : state === "submitting"
        ? "Submitting"
        : baseTitle;

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col">
      <SectionHeader
        title={title}
        subtitle={task.language}
        backHref="/user/tasks"
      />

      <div className="flex flex-1 items-center justify-center py-4">
        <div className="flex w-full max-w-2xl flex-col items-center gap-8">
          {/* IDLE */}
          {state === "idle" && (
            <>
              <p className="text-center text-xl font-medium text-foreground sm:text-2xl">
                {task.prompt}
                {!isRead && <span aria-hidden> …………</span>}
              </p>

              {task.sample ? (
                <div className="w-full rounded-2xl bg-surface p-6 text-surface-foreground sm:p-8">
                  <p className="text-lg leading-relaxed">{task.sample}</p>
                </div>
              ) : isRead ? (
                <div
                  className="h-48 w-full rounded-2xl bg-surface sm:h-56"
                  aria-hidden
                />
              ) : (
                <div
                  className="flex h-32 w-32 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-glow sm:h-36 sm:w-36"
                  aria-hidden
                >
                  <Mic className="h-14 w-14" />
                </div>
              )}

              <div className="flex w-full flex-col items-center gap-3">
                {!isRead && (
                  <label className="w-full max-w-md">
                    <input
                      type="file"
                      accept="audio/*"
                      className="sr-only"
                      onChange={onUpload}
                    />
                    <span className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-10 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                      <Upload className="h-5 w-5" /> Upload audio
                    </span>
                  </label>
                )}
                <Button
                  variant="cta"
                  size="xl"
                  className="w-full max-w-md"
                  onClick={startRecording}
                >
                  {isRead ? "Start reading" : "Start recording"}
                </Button>
              </div>
            </>
          )}

          {/* RECORDING / PAUSED */}
          {(recording || paused) && (
            <>
              <p
                role="status"
                aria-live="polite"
                className="text-center text-xl font-medium text-foreground sm:text-2xl"
              >
                {paused ? "Paused" : "Recording in progress……"}
              </p>

              <div
                className="flex h-24 items-end justify-center gap-1.5"
                aria-hidden
              >
                {levels.map((lv, i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-full bg-primary transition-[height] duration-100"
                    style={{ height: `${Math.round(lv * 100)}%` }}
                  />
                ))}
              </div>

              <div className="text-center">
                <p className="text-4xl font-bold tabular-nums text-foreground">
                  {fmt(elapsed)}
                </p>
                {remaining != null && (
                  <p className="mt-1 text-sm italic text-muted-foreground">
                    Remaining time {fmt(remaining)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-8">
                <button
                  type="button"
                  aria-label="Resume"
                  onClick={resumeRecording}
                  disabled={!paused}
                  className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Play className="h-8 w-8" />
                </button>
                <button
                  type="button"
                  aria-label={paused ? "Resume recording" : "Pause recording"}
                  onClick={paused ? resumeRecording : pauseRecording}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {paused ? (
                    <Play className="h-7 w-7" />
                  ) : (
                    <Pause className="h-7 w-7" />
                  )}
                </button>
                <button
                  type="button"
                  aria-label="Stop recording"
                  onClick={stopRecording}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cta text-cta-foreground transition-colors hover:bg-cta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Square className="h-5 w-5" />
                </button>
              </div>
            </>
          )}

          {/* RECORDED — Playback */}
          {state === "recorded" && (
            <>
              <p className="text-center text-xl font-medium text-foreground sm:text-2xl">
                Listen to your recording
              </p>
              {audioUrl && (
                <CircularPlayer src={audioUrl} fallbackSecs={elapsed} />
              )}
              <div className="flex w-full flex-col items-center gap-3">
                <Button
                  variant="default"
                  size="xl"
                  className="w-full max-w-md"
                  onClick={reset}
                >
                  Record again
                </Button>
                <Button
                  variant="cta"
                  size="xl"
                  className="w-full max-w-md"
                  onClick={submit}
                >
                  Submit
                </Button>
              </div>
            </>
          )}

          {/* SUBMITTING */}
          {state === "submitting" && (
            <div className="relative mt-10 w-full max-w-md">
              <span className="absolute -top-9 left-1/2 z-10 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-cta text-cta-foreground">
                <Upload className="h-9 w-9" />
              </span>
              <div className="flex flex-col items-center gap-3 rounded-3xl bg-primary px-6 pb-10 pt-16 text-center text-primary-foreground">
                <p className="text-2xl font-bold">Uploading your audio</p>
                <p className="text-sm text-primary-foreground/80">
                  Please wait, this may take a few seconds
                </p>
              </div>
            </div>
          )}

          {/* SUBMITTED */}
          {state === "submitted" && (
            <div className="relative mt-10 w-full max-w-md">
              <span className="absolute -top-9 left-1/2 z-10 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-cta text-primary">
                <Check className="h-10 w-10" />
              </span>
              <div className="flex min-h-56 flex-col items-center justify-center gap-2 rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground">
                <p className="text-2xl font-bold">Recording Submitted</p>
                <p className="text-sm text-primary-foreground/80">
                  Sent for review (stubbed — API pending).
                </p>
              </div>
            </div>
          )}

          {/* ERROR */}
          {state === "error" && (
            <div className="flex w-full max-w-md flex-col items-center gap-4">
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <span>{errorMsg}</span>
              </div>
              <Button
                variant="cta"
                size="xl"
                className="w-full"
                onClick={startRecording}
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <NextArrow href={nextHref} label={nextLabel} />
      </div>
    </div>
  );
}
