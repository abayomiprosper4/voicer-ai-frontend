"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { HowItWorks } from "@/components/HowItWorks";
import { Roles } from "@/components/Roles";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";
import { Mic, ArrowRight } from "lucide-react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, TextPlugin, ScrollTrigger);
}

let hasAnimated = false;

export default function LandingPage() {
  const container = useRef(null);

useGSAP(
  () => {
    const mm = gsap.matchMedia();


    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline();
      
      tl.from(".navbar-anim", { y: -20, opacity: 0, duration: 0.8 });
      tl.from(".hero-title", { duration: 1.2, text: "", ease: "none" });
      tl.from(".hero-title-2", { duration: 1.2, text: "", ease: "none" });
      
      tl.from(".mic-content", {
        scale: 0.8,
        opacity: 0, 
        duration: 1.2,
        ease: "power2.out",
      }, "-=0.5");

            tl.from(
        ".hero-content",
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          clearProps: "all",
        },
        "-=0.8",
      );
      return () => {
      };
    });

    mm.add("(max-width: 767px)", () => {
      gsap.set(".mic-content", { clearProps: "all" });
      
      const tl = gsap.timeline();
      tl.from(".hero-title", { duration: 1, text: "" });
    });

    [".section-how", ".section-roles", ".section-cta"].forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 1,
      });
    });
  },
  { scope: container }
);

  return (
    <div
      ref={container}
      className="min-h-screen bg-[#E5F7FA]/10 selection:bg-teal-500/30 overflow-x-hidden"
    >
      <Navbar />
      <header className="relative flex flex-col md:flex-row items-center justify-between pt-32 md:pt-48 pb-24 px-6 max-w-7xl mx-auto z-20">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full md:w-150 h-75 bg-[#1089a0]/15 blur-[120px] -z-10" />

        <div className="w-full md:max-w-3xl">
          <h1 className="text-7xl sm:text-6xl md:text-8xl font-bold text-left text-[#212932]/90 mb-8 tracking-tighter">
            <span className="hero-title">The audio engine</span>
            <br />
            <span className="hero-title-2 text-gradient">
              For African LLMs.
            </span>
          </h1>

          <div className="hero-content text-lg md:text-2xl text-[#212932]/80 mb-10 max-w-xl leading-relaxed">
            The No.1 professional toolkit for building high-quality African
            language datasets.
          </div>

          <div className="hero-content flex flex-col sm:flex-row gap-4">
            <Link href="#how">
              <Button
                size="lg"
                className="w-full sm:w-auto cursor-pointer bg-[#1089a0] hover:bg-[#0d768a] rounded-full px-10 h-14 text-white text-lg gap-2 shadow-xl shadow-teal-900/20"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="ghost"
                className="w-full sm:w-auto cursor-pointer text-black bg-[#212932]/10 hover:bg-[#212932]/20 rounded-full px-10 h-14 text-lg"
              >
                Log in
              </Button>
            </Link>
          </div>
        </div>
        <div
          className="mic-content absolute md:relative top-1/2 left-1/2 md:left-auto md:top-0 md:right-0 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 opacity-[0.05] md:opacity-100 -z-10 md:z-10 pointer-events-none md:pointer-events-auto"
        >
          <Mic
            className="w-72 h-72 sm:w-80 sm:h-80 md:w-72 md:h-72 lg:w-80 lg:h-80 text-[#1089a0]"
            strokeWidth={1.5}
          />
        </div>
      </header>

      <div className="section-how">
        <HowItWorks />
      </div>
      <div className="section-roles">
        <Roles />
      </div>
      <div className="section-cta">
        <CTA />
      </div>

      <Footer />
    </div>
  );
}
