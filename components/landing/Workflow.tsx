"use client";

import { motion } from "motion/react";

const steps = [
  { step: "01", title: "Create Projects", desc: "Define languages, deadlines, and task instructions in a dedicated workspace." },
  { step: "02", title: "Invite & Assign", desc: "Onboard contributors and reviewers, automatically assigning them based on language proficiency." },
  { step: "03", title: "Record Audio", desc: "Contributors record and submit prompts directly from their browser, no installs required." },
  { step: "04", title: "Review & Validate", desc: "Reviewers listen, rate, and approve takes. Rejected takes receive feedback for resubmission." },
  { step: "05", title: "Export Datasets", desc: "Download clean, validated datasets in standard formats like JSON or CSV with one click." }
];

export function Workflow() {
  return (
    <section id="how" className="py-24 px-6 border-b border-border">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 max-w-xl">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest border border-border inline-block px-3 py-1 mb-6">Workflow</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            A structured lifecycle for pristine speech data.
          </h2>
        </div>

        <div className="grid gap-px bg-border border border-border">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-background p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 hover:bg-muted/30 transition-colors"
            >
              <div className="text-3xl sm:text-4xl font-serif text-[#1089a0] shrink-0 font-bold">{s.step}</div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
