"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type LoaderVariant = 
  | "pulse-sequential"
  | "bounce"
  | "wave"
  | "squeeze"
  | "swap"
  | "converge"
  | "scale-sync"
  | "flip"
  | "breathe"
  | "collide";

const VARIANTS: LoaderVariant[] = [
  "pulse-sequential", "bounce", "wave", "squeeze", "swap",
  "converge", "scale-sync", "flip", "breathe", "collide"
];

// For tiny sizes (buttons), restrict to simpler, less chaotic animations
const SIMPLE_VARIANTS: LoaderVariant[] = [
  "pulse-sequential", "bounce", "wave", "scale-sync", "breathe", "collide"
];

interface LogoLoaderProps {
  className?: string;
  variant?: LoaderVariant;
  simple?: boolean; // Force simple variant pool (auto-detected via className normally)
}

export function LogoLoader({ className, variant, simple }: LogoLoaderProps) {
  const [activeVariant, setActiveVariant] = React.useState<LoaderVariant>("pulse-sequential");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (variant) {
      setActiveVariant(variant);
    } else {
      setActiveVariant("pulse-sequential");
    }
  }, [variant]);

  // Before hydration, render a static loader to prevent hydration mismatch
  const renderVariant = mounted ? activeVariant : (variant || "pulse-sequential");

  return (
    <div className={cn("inline-flex items-center justify-center shrink-0", className)}>
      <svg 
        width="1em" 
        height="1em" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <Dots variant={renderVariant} />
      </svg>
    </div>
  );
}

function Dots({ variant }: { variant: LoaderVariant }) {
  const dot1 = { cx: 4, cy: 12, r: 4, fill: "currentColor" };
  const dot2 = { cx: 12, cy: 12, r: 2.5, fill: "currentColor", opacity: 0.7 };
  const dot3 = { cx: 19, cy: 12, r: 1.5, fill: "currentColor", opacity: 0.4 };

  switch (variant) {
    case "pulse-sequential":
      return (
        <>
          <motion.circle {...dot1} animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} />
          <motion.circle {...dot2} animate={{ opacity: [0.7, 0.1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
          <motion.circle {...dot3} animate={{ opacity: [0.4, 0.05, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} />
        </>
      );
    case "bounce":
      return (
        <>
          <motion.circle {...dot1} animate={{ cy: [12, 7, 12] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0 }} />
          <motion.circle {...dot2} animate={{ cy: [12, 7, 12] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.15 }} />
          <motion.circle {...dot3} animate={{ cy: [12, 7, 12] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
        </>
      );
    case "wave":
      return (
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
          <motion.circle {...dot1} animate={{ y: [0, -3, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0 }} />
          <motion.circle {...dot2} animate={{ y: [0, -3, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
          <motion.circle {...dot3} animate={{ y: [0, -3, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
        </motion.g>
      );
    case "squeeze":
      return (
        <>
          <motion.circle {...dot1} animate={{ cx: [4, 9, 4] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
          <motion.circle {...dot2} animate={{ scaleY: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "12px 12px" }} />
          <motion.circle {...dot3} animate={{ cx: [19, 15, 19] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
        </>
      );
    case "swap":
      return (
        <>
          <motion.circle {...dot1} animate={{ cx: [4, 19, 4] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
          <circle {...dot2} />
          <motion.circle {...dot3} animate={{ cx: [19, 4, 19] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
        </>
      );
    case "converge":
      return (
        <>
          <motion.circle {...dot1} animate={{ cx: [4, 12, 4], opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
          <motion.circle {...dot2} animate={{ r: [2.5, 4, 2.5], opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
          <motion.circle {...dot3} animate={{ cx: [19, 12, 19], opacity: [0.4, 0, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
        </>
      );
    case "scale-sync":
      return (
        <>
          <motion.circle {...dot1} animate={{ scale: [1, 0.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "4px 12px" }} />
          <motion.circle {...dot2} animate={{ scale: [1, 0.5, 1], opacity: [0.7, 0.3, 0.7] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "12px 12px" }} />
          <motion.circle {...dot3} animate={{ scale: [1, 0.5, 1], opacity: [0.4, 0.1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "19px 12px" }} />
        </>
      );
    case "flip":
      return (
        <motion.g animate={{ rotateY: [0, 180, 360] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "12px 12px" }}>
          <circle {...dot1} />
          <circle {...dot2} />
          <circle {...dot3} />
        </motion.g>
      );
    case "breathe":
      return (
        <motion.g animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "12px 12px" }}>
          <circle {...dot1} />
          <circle {...dot2} />
          <circle {...dot3} />
        </motion.g>
      );
    case "collide":
      return (
        <>
          <motion.circle {...dot1} animate={{ 
            cx: [4, 15, 6, 18, 4], 
            cy: [12, 6, 18, 10, 12] 
          }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
          
          <motion.circle {...dot2} animate={{ 
            cx: [12, 5, 20, 8, 12], 
            cy: [12, 16, 8, 18, 12] 
          }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
          
          <motion.circle {...dot3} animate={{ 
            cx: [19, 8, 14, 5, 19], 
            cy: [12, 20, 5, 15, 12] 
          }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
        </>
      );
    default:
      return null;
  }
}
