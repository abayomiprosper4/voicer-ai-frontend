"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-16 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-2 md:col-span-1 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center">
              <Logo className="w-4 h-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-foreground">
              Voicer
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            The multi-tenant collaborative platform for building, managing, reviewing, and scaling audio datasets.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Product</h4>
          <ul className="space-y-3">
            <li><a href="#problem" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Why Voicer</a></li>
            <li><a href="#how" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Workflow</a></li>
            <li><a href="#roles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Roles</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Legal</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Social</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Twitter</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Discord</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Voicer. All Rights Reserved.
        </p>
        <p className="text-sm text-muted-foreground">
          Built for scale.
        </p>
      </div>
    </footer>
  );
};