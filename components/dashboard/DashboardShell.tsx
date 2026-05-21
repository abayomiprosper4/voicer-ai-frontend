"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mic,
  Menu,
  X,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NAV_ITEMS,
  ROLE_LABELS,
  activeHref,
  type DashboardRole,
} from "./nav-config";

type DashboardShellProps = {
  role: DashboardRole;
  children: React.ReactNode;
};

const COLLAPSE_KEY = "voicer.sidebarCollapsed";

/**
 * Role-agnostic dashboard chrome (Figma-accurate).
 *
 * Desktop (md+): bordered rounded sidebar of pill items; active = dark fill.
 * Collapsible to an icon-only rail (preference persisted in localStorage).
 * Mobile (<md): top app bar + slide-in drawer.
 *
 * Colors come exclusively from the globals.css token bridge — no hex.
 */
export function DashboardShell({ role, children }: DashboardShellProps) {
  const pathname = usePathname();
  const items = NAV_ITEMS[role];
  const active = activeHref(items, pathname);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Restore collapse preference after mount (avoids hydration mismatch).
  useEffect(() => {
    setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
  }, []);

  function toggleCollapsed() {
    setCollapsed((c) => {
      const next = !c;
      window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  // Close the drawer on route change.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll + Escape-to-close while the drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  const item = (
    label: string,
    href: string,
    Icon: React.ComponentType<{ className?: string }>,
    isActive: boolean,
    showLabel: boolean,
  ) => (
    <Link
      key={href}
      href={href}
      aria-current={isActive ? "page" : undefined}
      title={showLabel ? undefined : label}
      className={cn(
        "flex h-11 items-center gap-3 rounded-xl border px-4 text-sm font-medium transition-colors",
        showLabel ? "justify-start" : "justify-center px-0",
        isActive
          ? "border-transparent bg-cta text-cta-foreground"
          : "border-border text-foreground hover:bg-secondary",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {showLabel && <span className="truncate">{label}</span>}
    </Link>
  );

  // The sidebar body, shared by the desktop rail and the mobile drawer.
  const sidebarBody = (showLabels: boolean, showCollapse: boolean) => (
    <div className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-background p-3">
      <nav
        className="flex flex-col gap-2 pt-2"
        aria-label={`${ROLE_LABELS[role]} navigation`}
      >
        {items.map((nav) =>
          item(nav.label, nav.href, nav.icon, active === nav.href, showLabels),
        )}
        {item("Log Out", "/login", LogOut, false, showLabels)}
      </nav>

      <div className="flex-1" />

      {showCollapse && (
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={collapsed}
          className={cn(
            "flex h-11 items-center gap-3 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary",
            collapsed ? "justify-center px-0" : "justify-start",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5 shrink-0" />
          ) : (
            <PanelLeftClose className="h-5 w-5 shrink-0" />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>
      )}
    </div>
  );

  const brand = (
    <Link href="/user" className="group flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow transition-transform group-hover:scale-105">
        <Mic className="h-5 w-5" />
      </span>
      <span className="text-lg font-bold tracking-tight text-foreground">
        Voicer <span className="text-primary">AI</span>
      </span>
    </Link>
  );

  const railWidth = collapsed ? "md:w-24" : "md:w-64";
  const contentPad = collapsed ? "md:pl-24" : "md:pl-64";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:fixed md:inset-y-0 md:left-0 md:block md:p-3",
          railWidth,
        )}
      >
        {sidebarBody(!collapsed, true)}
      </aside>

      {/* Mobile top app bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:hidden">
        {brand}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${ROLE_LABELS[role]} menu`}
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              {brand}
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="min-h-0 flex-1">{sidebarBody(true, false)}</div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={contentPad}>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
