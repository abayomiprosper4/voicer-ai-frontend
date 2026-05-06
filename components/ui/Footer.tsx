"use client";

import { Mic } from "lucide-react";

export const Footer = () => {
    return (
    <footer className="border-t border-border/60 py-10">
      <div className="container flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-hero flex items-center justify-center">
            <Mic className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">Voicer AI</span>
          <span>© {new Date().getFullYear()}</span> All Rights Reserved.
        </div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
    );
}