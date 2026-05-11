"use client";

import Link from "next/link";
import gsap from "gsap";
import { Navbar } from "@/components/ui/navbar";
import { useGSAP } from "@gsap/react";


export default function LoginPage() {
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".navbar-anim", {
      y: -20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
    gsap.from(".main-txt", {
      delay: 0.5,
      x: -80,
      opacity: 0,
      duration: 1.0,
      ease: "power3.out",
    });
    gsap.from(".txt-box", {
      delay: 0.5,
      x: 80,
      opacity: 0,
      duration: 1.0,
      ease: "power3.out",
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#E5F7FA]/10 selection:bg-teal-500/30 overflow-x-hidden flex items-center justify-center p-6">
      <Navbar />
      <div className="max-w-6xl w-full mt-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full md:w-260 h-96 bg-[#1089a0]/15 blur-[120px] -z-10" />
        <div className="main-txt space-y-4">
          <p className="text-[#212932] text-3xl font-medium">
            Welcome to Voicer Ai
          </p>
          <h1 className="text-6xl md:text-7xl font-semibold leading-[1.2] text-[#212932] tracking-tight">
            Building AI that <br />
            understands
            <br /> African voices.
          </h1>
        </div>
        <div className="txt-box flex justify-center lg:justify-end">
          <div className="w-full max-w-125 border border-gray-400 rounded-2xl p-8 py-20 shadow-sm ">
            <h2 className="text-3xl font-semibold text-center text-[#212932] mb-10">
              Log in
            </h2>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full py-2 px-4 rounded-xl bg-[#99CDD4] text-[#212932] placeholder:text-white/80 focus:outline-none border-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full py-2 px-4 rounded-xl bg-[#99CDD4] text-[#212932] placeholder:text-white/80 focus:outline-none border-none"
              />
              <div className="relative"></div>
              <div className="text-right">
                <button
                  type="button"
                  className="text-[#1089a0] text-xs hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-2 bg-[#212932] text-white rounded-full font-bold text-lg hover:bg-[#2c3742] transition-colors cursor-pointer"
              >
                Log in
              </button>
              <Link href="/signup">
                <button
                  type="submit"
                  className="w-full py-2 border border-[#212932] text-[#212932] rounded-full font-bold text-lg hover:bg-[#2c3742] hover:text-white transition-colors cursor-pointer"
                >
                  New User? Sign Up
                </button>
              </Link>
            </form>
            <div className="flex justify-center gap-6 mt-8 text-[#212932] font-bold">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
