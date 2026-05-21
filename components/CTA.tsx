"use client";

import { Plus, ArrowRight} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export const CTA = () => {
  return (
    <section id="CTA" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[3rem] bg-linear-to-br from-[#1089a0] to-[#25707d] p-10 md:p-20 overflow-hidden shadow-glow-lg">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Your voice belongs <br /> in the dataset.
              </h2>
              <p className="text-white/80 text-lg max-w-md leading-relaxed">
                Join thousands of contributors recording Yoruba, Pidgin, and English — one prompt at a time.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Link href="/login">
              <Button size="lg" variant="secondary" className="h-14 px-8 cursor-pointer rounded-full gap-2 bg-white text-[#1089a0] hover:bg-white/90 shadow-xl">
                <Plus className="w-5 h-5" /> Create a Project
              </Button>
              </Link>
              <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 cursor-pointer rounded-full gap-2 bg-transparent border-white/40 text-white hover:bg-white/10">
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
