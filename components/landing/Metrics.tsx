"use client";

import { motion } from "motion/react";
import { Activity } from "lucide-react";

const stats = [
  { label: "Active Contributors", value: "Monitor" },
  { label: "Task Completion", value: "Track" },
  { label: "Approval Rates", value: "Optimize" },
  { label: "Dataset Exports", value: "Scale" },
];

export function Metrics() {
  return (
    <section className="py-24 bg-foreground text-background px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-xs font-bold text-background/60 uppercase tracking-widest border border-background/20 inline-block px-3 py-1 mb-6">Analytics</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Data visibility at every step.
          </h2>
          <p className="text-background/80 text-base leading-relaxed max-w-sm mb-10">
            Never guess the status of your dataset again. Voicer provides real-time analytics on who is submitting, who is reviewing, and what your final yield looks like.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-px bg-background/20 border border-background/20"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-foreground p-6 sm:p-8 hover:bg-background/10 transition-colors">
              <Activity className="w-5 h-5 text-[#1089a0] mb-4" />
              <div className="text-xs font-semibold text-background/60 uppercase tracking-wider mb-2">{s.value}</div>
              <div className="text-base sm:text-lg font-bold">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
