"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type RecorderStatus = "idle" | "recording" | "recorded";

export interface UseAudioRecorderReturn {
  status: RecorderStatus;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  audioBlob: Blob | null;
  audioDuration: number;
  audioUrl: string | null;
  mimeType: string;
  reset: () => void;
  error: string | null;
}

/**
 * Negotiate the best supported audio mime type for MediaRecorder.
 * Tries webm (Chrome/Firefox/Edge) first, then mp4 (Safari), then ogg.
 */
function getSupportedMimeType(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
    "audio/ogg",
  ];

  for (const mime of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mime)) {
      return mime;
    }
  }

  // Fallback — let the browser choose
  return "";
}

/**
 * Extract the base mime type (e.g. "audio/webm" from "audio/webm;codecs=opus")
 * for use in upload headers.
 */
export function getBaseMimeType(mimeType: string): string {
  return mimeType.split(";")[0] || "audio/webm";
}

/**
 * A reusable hook that encapsulates all MediaRecorder logic.
 *
 * State machine: idle → recording → recorded → idle (via reset)
 *
 * Usage:
 * ```tsx
 * const { status, startRecording, stopRecording, audioBlob, audioDuration, audioUrl, reset, error } = useAudioRecorder();
 * ```
 */
export function useAudioRecorder(): UseAudioRecorderReturn {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Revoke object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Stop any active stream tracks
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = useCallback(async () => {
    // Clean up previous state
    setError(null);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setAudioDuration(0);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      const negotiatedMime = getSupportedMimeType();
      setMimeType(negotiatedMime);

      const options: MediaRecorderOptions = {};
      if (negotiatedMime) {
        options.mimeType = negotiatedMime;
      }

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        // Stop the timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        // Calculate final duration
        const finalDuration = Math.round((Date.now() - startTimeRef.current) / 1000);
        setAudioDuration(finalDuration);

        // Assemble the blob
        const finalMime = negotiatedMime || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: finalMime });
        
        if (blob.size === 0) {
          setError("Recording was too short or empty. Please try again.");
          setStatus("idle");
          stream.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
          return;
        }

        setAudioBlob(blob);

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop all mic tracks
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        setStatus("recorded");
      };

      recorder.onerror = () => {
        setError("Recording failed. Please try again.");
        setStatus("idle");
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      // Start recording with 250ms timeslice for progressive data collection
      recorder.start(250);
      startTimeRef.current = Date.now();
      setStatus("recording");

      // Start a timer to track elapsed time
      timerRef.current = setInterval(() => {
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        setAudioDuration(elapsed);
      }, 500);
    } catch (err: any) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Microphone access was denied. Please allow microphone permissions in your browser settings and try again.");
      } else if (err.name === "NotFoundError") {
        setError("No microphone found. Please connect a microphone and try again.");
      } else if (err.name === "NotReadableError") {
        setError("Your microphone is already in use by another application.");
      } else {
        setError("Could not access microphone. Please check your device settings.");
      }
      setStatus("idle");
    }
  }, [audioUrl]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      // Status will be set to "recorded" in the onstop handler
    }
  }, []);

  const reset = useCallback(() => {
    // Stop recording if active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Revoke URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    // Stop stream
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    // Reset all state
    setStatus("idle");
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioDuration(0);
    setError(null);
    chunksRef.current = [];
    mediaRecorderRef.current = null;
  }, [audioUrl]);

  return {
    status,
    startRecording,
    stopRecording,
    audioBlob,
    audioDuration,
    audioUrl,
    mimeType,
    reset,
    error,
  };
}
