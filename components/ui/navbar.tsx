"use client";

import Link from "next/link";
import { Button } from "./button";
import { Mic, Plus } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1200px,calc(100%-2rem))]">
      <nav className="navbar-anim glass backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-[#25707D] flex items-center justify-center shadow-glow transition-transform group-hover:scale-105">
              <Mic className="w-5 h-5 text-[#E5F7FA]" />
            </div>
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            Voicer <span className="text-primary">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#roles" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#CTA" className="hover:text-foreground transition-colors">
            CTA
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-[#25707D] cursor-pointer text-white hover:opacity-90 shadow-glow gap-1.5"
            onClick={() => (window.location.href = "/user")}
          >
            <Plus className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">Create a Project</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </nav>
    </header>
  );
};
