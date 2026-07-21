import type { ComponentType } from "react";
import {
  Home,
  ListChecks,
  Bell,
  ClipboardCheck,
  User,
  FolderKanban,
  Users,
  Settings,
  PlayCircle
} from "lucide-react";

// Version-agnostic icon type
export type NavIcon = ComponentType<{ className?: string }>;

export type NavItem = {
  label: string;
  href: string;
  icon: NavIcon;
};

export type DashboardRole = "owner" | "admin" | "contributor" | "reviewer";

export const ROLE_LABELS: Record<DashboardRole, string> = {
  owner: "Organization Owner",
  admin: "Project Admin",
  contributor: "Contributor",
  reviewer: "Reviewer",
};

/**
 * Dynamically generate navigation based on the user's role and the current project context.
 */
export function getNavItems(role: DashboardRole, orgSlug: string, projectSlug: string): NavItem[] {
  const base = `/${orgSlug}/${projectSlug}`;
  
  if (role === 'owner' || role === 'admin') {
    return [
      { label: "Overview", href: `${base}`, icon: Home },
      { label: "Tasks", href: `${base}/tasks`, icon: ListChecks },
      { label: "Members", href: `${base}/members`, icon: Users },
      { label: "Settings", href: `${base}/settings`, icon: Settings },
    ];
  }
  
  if (role === 'contributor') {
    return [
      { label: "Dashboard", href: `${base}`, icon: Home },
      { label: "Available Tasks", href: `${base}/available`, icon: ListChecks },
      { label: "My Submissions", href: `${base}/submissions`, icon: ClipboardCheck },
    ];
  }
  
  if (role === 'reviewer') {
    return [
      { label: "Dashboard", href: `${base}`, icon: Home },
      { label: "Review Queue", href: `${base}/queue`, icon: PlayCircle },
      { label: "History", href: `${base}/history`, icon: ClipboardCheck },
    ];
  }

  return [];
}

/**
 * Returns the href of the single nav item to highlight for a pathname
 */
export function activeHref(items: NavItem[], pathname: string): string | null {
  let best: string | null = null;
  for (const item of items) {
    const matches =
      pathname === item.href || pathname.startsWith(item.href + "/");
    if (matches && (best === null || item.href.length > best.length)) {
      best = item.href;
    }
  }
  return best;
}
