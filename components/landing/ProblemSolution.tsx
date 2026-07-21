"use client";

import { motion } from "motion/react";
import { ArrowRight, Database, X } from "lucide-react";

export function ProblemSolution() {
  return (
    <section id="problem" className="py-24 px-6 max-w-5xl mx-auto relative border-b border-border">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest border border-border inline-block px-3 py-1">The Old Way</div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Stop managing datasets in <span className="line-through text-muted-foreground">spreadsheets</span>.
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Relying on fragmented tools like Google Forms, WhatsApp groups, and shared drives creates a nightmare for contributor management, quality control, and dataset tracking.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
             {['Spreadsheets', 'WhatsApp', 'Google Drive'].map((tool) => (
               <div key={tool} className="flex items-center gap-2 border border-border bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground">
                 <X className="w-3 h-3" /> {tool}
               </div>
             ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-foreground text-background border border-foreground p-8 sm:p-10 space-y-6"
        >
          <div className="text-xs font-bold text-background/60 uppercase tracking-widest border border-background/20 inline-block px-3 py-1">The New Way</div>
          <h3 className="text-2xl sm:text-3xl font-bold">Centralized Infrastructure</h3>
          <p className="text-background/80 text-base leading-relaxed">
            Voicer centralizes the entire dataset collection process into one platform. Think of it as GitHub, but specifically engineered for speech dataset collection.
          </p>
          <ul className="space-y-4 pt-4 border-t border-background/20">
            {['Structured Review Workflows', 'Scalable Contributor Management', 'One-Click Validated Exports'].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm font-medium">
                <Database className="w-4 h-4 text-[#1089a0]" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
