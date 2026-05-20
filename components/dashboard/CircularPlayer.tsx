"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

function fmt(total: number) {
  const t = Math.max(0, Math.floor(total));
  const m = Math.floor(t / 60)
    .toString()
    .padStart(2, "0");
  const s = (t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * Circular audio player for the Playback state — progress ring around a
 * play/pause control, time below. Falls back to the known recorded length
 * when the blob's metadata duration is non-finite (common with webm).
 */
export function CircularPlayer({
  src,
  fallbackSecs,
}: {
  src: string;
  fallbackSecs: number;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(fallbackSecs);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onMeta = () => {
      if (Number.isFinite(a.duration) && a.duration > 0) setDuration(a.duration);
    };
    const onTime = () => setCurrent(a.currentTime);
    const onEnd = () => {
      setPlaying(false);
      setCurrent(0);
    };
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
    };
  }, [src]);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play();
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  }

  const R = 70;
  const C = 2 * Math.PI * R;
  const progress = duration > 0 ? Math.min(1, current / duration) : 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <audio ref={audioRef} src={src} preload="metadata" className="sr-only" />

      <div className="relative h-44 w-44">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={R}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className="stroke-primary/20"
          />
          <circle
            cx="80"
            cy="80"
            r={R}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className="stroke-primary transition-[stroke-dashoffset] duration-150"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
          />
        </svg>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause playback" : "Play recording"}
          className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full text-primary transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {playing ? (
            <Pause className="h-10 w-10" />
          ) : (
            <Play className="h-10 w-10 translate-x-0.5" />
          )}
        </button>
      </div>

      <p className="text-3xl font-bold tabular-nums text-foreground">
        {fmt(playing ? current : duration)}
      </p>
    </div>
  );
}
