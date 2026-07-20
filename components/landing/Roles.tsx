"use client";

import { motion } from "motion/react";

const roles = [
  { role: "Organization Owner", desc: "Initiates projects, monitors overall progress, manages the team, and exports the final validated datasets." },
  { role: "Project Admin", desc: "Coordinates day-to-day operations, creates specific collection tasks, and manages contributors and reviewers." },
  { role: "Contributor", desc: "Reads prompts, records audio directly in the browser, and resubmits takes based on reviewer feedback." },
  { role: "Reviewer", desc: "Maintains quality control by listening to submissions, approving good takes, and providing constructive feedback on bad ones." },
];

export function Roles() {
  return (
    <section id="roles" className="py-24 px-6 max-w-5xl mx-auto border-b border-border">
      <div className="mb-16 text-center">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest border border-border inline-block px-3 py-1 mb-6">Collaboration</div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Built for every member of the team.
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-px bg-border border border-border">
        {roles.map((r, i) => (
          <motion.div
            key={r.role}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-background p-8 hover:bg-foreground hover:text-background transition-colors group"
          >
            <div className="text-xs font-mono mb-4 text-[#1089a0]">[{String(i + 1).padStart(2, '0')}]</div>
            <h3 className="text-lg font-bold mb-3">{r.role}</h3>
            <p className="text-sm leading-relaxed opacity-70 group-hover:opacity-90">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
