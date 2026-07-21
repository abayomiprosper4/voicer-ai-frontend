"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Mic, CheckCircle, FileAudio } from "lucide-react";
import { useRef } from "react";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  const yText = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative flex flex-col items-center justify-center pt-40 pb-20 px-6 max-w-5xl mx-auto z-20 min-h-[85vh] overflow-hidden">
      
      {/* Floating Polaroids Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [-4, -6, -4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-[5%] md:left-[10%] w-32 h-36 bg-background border border-border shadow-xl rounded-sm p-3 rotate-[-4deg]"
        >
          <div className="w-full h-20 bg-muted/50 rounded-sm mb-2 flex items-center justify-center">
            <Mic className="text-muted-foreground w-8 h-8" />
          </div>
          <div className="w-20 h-2 bg-muted rounded-full"></div>
          <div className="w-12 h-2 bg-muted rounded-full mt-1.5"></div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [6, 8, 6] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-[2%] md:right-[8%] w-36 h-40 bg-background border border-border shadow-xl rounded-sm p-3 rotate-[6deg]"
        >
          <div className="w-full h-24 bg-muted/50 rounded-sm mb-2 flex flex-col items-center justify-center gap-1">
            <CheckCircle className="text-emerald-500 w-8 h-8" />
            <span className="text-[10px] font-medium text-muted-foreground">Approved</span>
          </div>
          <div className="w-24 h-2 bg-muted rounded-full"></div>
          <div className="w-16 h-2 bg-muted rounded-full mt-1.5"></div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, -10, 0], rotate: [-2, 0, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-32 left-[15%] md:left-[20%] w-28 h-32 bg-background border border-border shadow-lg rounded-sm p-2.5 rotate-[-2deg] opacity-70"
        >
          <div className="w-full h-16 bg-muted/50 rounded-sm mb-2 flex items-center justify-center">
            <FileAudio className="text-muted-foreground w-6 h-6" />
          </div>
          <div className="w-16 h-1.5 bg-muted rounded-full"></div>
          <div className="w-10 h-1.5 bg-muted rounded-full mt-1.5"></div>
        </motion.div>
      </div>

      <motion.div style={{ y: yText, opacity }} className="w-full text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block border border-border px-4 py-1.5 rounded-full text-xs font-medium text-muted-foreground mb-8 uppercase tracking-widest"
        >
          Voicer V1.0
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight leading-[1.1]"
        >
          Build, manage, review, and <span className="relative inline-block text-[#1089a0] italic z-10">
            scale
            <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-[120%] -ml-[10%] h-auto -z-10" viewBox="0 0 424 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M3 15.5C74 6.5 224 -1.5 421 9.5" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
              <path d="M9 21C86 14 233 8 415 17" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
            </svg>
          </span> audio datasets.
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-base sm:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          A collaborative platform for collecting, reviewing, managing, and exporting multilingual audio datasets without the spreadsheet chaos.
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full rounded-md px-8 h-12 text-sm font-semibold gap-2 bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              Start Building <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-border/50 -z-10" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-border" />
    </section>
  );
}
