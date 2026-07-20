"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-32 px-6 max-w-5xl mx-auto text-center border-b border-border">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 font-serif">
          Ready to <span className="italic text-[#1089a0]">scale</span> your audio collection?
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10">
          Stop managing datasets in spreadsheets and start building high-quality speech data with the infrastructure it deserves.
        </p>
        
        <div className="flex justify-center">
          <Link href="/login">
            <Button size="lg" className="rounded-md px-10 h-14 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors">
              Log in to Organization <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
