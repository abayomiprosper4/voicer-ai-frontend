"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Bell, UserCircle, ChevronRight, Menu } from "lucide-react";
import { useAuthMe } from "@/lib/api/queries";
import { getNavItems, activeHref, type DashboardRole } from "./nav-config";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const params = useParams();
  const orgSlug = params?.orgSlug as string | undefined;
  const projectSlug = params?.projectSlug as string | undefined;
  
  // TODO: Fetch user's actual role for this project. Defaulting to admin for now.
  const role: DashboardRole = "admin";

  const items = (orgSlug && projectSlug) ? getNavItems(role, orgSlug, projectSlug) : [];
  const active = activeHref(items, pathname);

  const { data: user, isLoading } = useAuthMe();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Top Header (Global Nav) */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
        <div className="flex h-16 items-center px-4 md:px-6 gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
              <Logo className="h-4 w-4" />
            </div>
          </Link>
          
          <div className="flex items-center text-sm font-medium text-muted-foreground ml-2 min-w-0">
            <Link href={`/${orgSlug}`} className="hover:text-foreground transition-colors truncate max-w-[120px] sm:max-w-none">
              {orgSlug}
            </Link>
            
            {projectSlug && (
              <>
                <ChevronRight className="h-4 w-4 mx-1 shrink-0 opacity-50" />
                <Link href={`/${orgSlug}/${projectSlug}`} className="text-foreground font-semibold truncate max-w-[150px] sm:max-w-none">
                  {projectSlug}
                </Link>
                <span className="hidden sm:inline-flex ml-3 px-2 py-0.5 rounded-full border border-border bg-muted/50 text-[10px] uppercase tracking-widest text-muted-foreground font-bold shrink-0">
                  {role}
                </span>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center space-x-3 sm:space-x-4 shrink-0">
            <button className="text-muted-foreground hover:text-foreground transition-colors relative h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {/* Notification Badge Example */}
              <span className="absolute top-1.5 right-1.5 sm:top-1 sm:right-1 h-2 w-2 rounded-full bg-primary border-2 border-background"></span>
            </button>
            <Link href="/settings" className="flex items-center gap-2 sm:border-l border-border sm:pl-4 hover:opacity-80 transition-opacity cursor-pointer">
              <UserCircle className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-medium hidden md:block hover:underline">
                {isLoading ? "Loading..." : user?.firstName || user?.email || "User"}
              </span>
            </Link>
          </div>
        </div>

        {/* Secondary Context Nav (Tabs) */}
        {items.length > 0 && (
          <div className="px-4 md:px-6 flex items-center gap-6 overflow-x-auto no-scrollbar border-t border-border/50">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  active === item.href
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
