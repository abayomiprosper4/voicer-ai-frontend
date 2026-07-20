"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
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
    <section ref={ref} className="relative flex flex-col items-center justify-center pt-40 pb-20 px-6 max-w-5xl mx-auto z-20 min-h-[85vh]">
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
          Build, manage, review, and <span className="text-[#1089a0] italic">scale</span> audio datasets.
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
