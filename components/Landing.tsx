"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/landing/Hero";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { Workflow } from "@/components/landing/Workflow";
import { Roles } from "@/components/landing/Roles";
import { Metrics } from "@/components/landing/Metrics";
import { CTA } from "@/components/landing/CTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[#1089a0]/30 overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <Workflow />
        <Roles />
        <Metrics />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
