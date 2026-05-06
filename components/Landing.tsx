"use client";

import { Navbar } from "@/components/ui/navbar";
import { HowItWorks } from "@/components/HowItWorks";
import { Roles } from "@/components/Roles";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";
import { 
  Mic, ArrowRight
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#E5F7FA]/10 selection:bg-teal-500/30 overflow-x-hidden">
<Navbar />
      <header className="relative pt-48 pb-24 px-6 text-center max-w-5xl mx-auto">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-150 h-75 bg-[#1089a0]/20 blur-[120px] -z-10" />
        <h1 className="text-6xl md:text-8xl font-bold text-[#212932]/90 mb-8 tracking-tighter">
          The audio engine<br /> 
          <span className="text-gradient">For African LLMs.</span>
        </h1>
        <p className="text-xl md:text-2xl text-[#212932] mb-12 max-w-3xl mx-auto leading-relaxed">
          The No.1 professional toolkit for building high-quality African language datasets.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-[#1089a0] hover:bg-[#0d768a] rounded-full px-10 h-14 text-white text-lg gap-2 shadow-xl shadow-teal-900/20">
            Get Started <ArrowRight className="w-5 h-5" />
          </Button>
          <Button size="lg" variant="ghost" className="text-black bg-[#212932]/20 hover:bg-[#212932]/30 shadow-teal-900/20 rounded-full px-10 h-14 text-lg">
            Log in
          </Button>
        </div>
      </header>
      <HowItWorks />
      <Roles />
      <CTA />
<Footer />
    </div>
  );
}