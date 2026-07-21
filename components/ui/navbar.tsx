"use client";

import Link from "next/link";
import { Button } from "./button";
import { Logo } from "./logo";

export const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center transition-transform group-hover:scale-105">
              <Logo className="w-4 h-4" />
            </div>
          </div>
          <span className="font-bold text-base tracking-tight text-foreground">
            Voicer
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#problem" className="hover:text-foreground transition-colors">
            Why Voicer
          </a>
          <a href="#how" className="hover:text-foreground transition-colors">
            Workflow
          </a>
          <a href="#roles" className="hover:text-foreground transition-colors">
            Roles
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              size="sm"
              variant="outline"
              className="text-foreground hover:bg-foreground hover:text-background transition-colors h-9 px-4 rounded-lg"
            >
              Log In
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};
