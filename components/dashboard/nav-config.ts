import type { ComponentType } from "react";
import {
  Home,
  ListChecks,
  MousePointerClick,
  Bell,
  ClipboardCheck,
  User,
  UserPlus,
  Inbox,
  BarChart3,
  FolderKanban,
  Users,
  LayoutDashboard,
} from "lucide-react";

/**
 * Single source of truth for dashboard navigation.
 *
 * The shell (sidebar / mobile drawer) is role-agnostic — it renders whatever
 * items it is handed. Contributor IA comes from the Figma sidebar; reviewer
 * and admin remain placeholders until their designs arrive.
 */

// Version-agnostic icon type (avoids depending on a specific lucide type export).
export type NavIcon = ComponentType<{ className?: string }>;

export type NavItem = {
  label: string;
  href: string;
  icon: NavIcon;
};

export type DashboardRole = "contributor" | "reviewer" | "admin";

export const ROLE_LABELS: Record<DashboardRole, string> = {
  contributor: "Contributor",
  reviewer: "Reviewer",
  admin: "Admin",
};

export const NAV_ITEMS: Record<DashboardRole, NavItem[]> = {
  // From the Figma contributor sidebar.
  contributor: [
    { label: "Dashboard", href: "/user", icon: Home },
    { label: "Task Management", href: "/user/tasks", icon: ListChecks },
    { label: "Select Project", href: "/user/select-project", icon: MousePointerClick },
    { label: "Notifications", href: "/user/notifications", icon: Bell },
    { label: "Submissions", href: "/user/submissions", icon: ClipboardCheck },
    { label: "Profile", href: "/user/profile", icon: User },
  ],
reviewer: [
  { label: "Dashboard", href: "/reviewer", icon: Home },
  { label: "Users List", href: "/reviewer/users", icon: Users },
  { label: "Project", href: "/reviewer/project", icon: FolderKanban },
  { label: "Notifications", href: "/reviewer/notifications", icon: Bell },
  { label: "History", href: "/reviewer/history", icon: ClipboardCheck },
  { label: "Profile", href: "/reviewer/profile", icon: User },
],
  admin: [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Users List", href: "/admin/users", icon: Users },
  { label: "Project", href: "/admin/projects", icon: FolderKanban },
  { label: "Reviewer's List", href: "/admin/reviewers", icon: Users },
  { label: "History", href: "/admin/history", icon: ClipboardCheck },
  { label: "Profile", href: "/admin/profile", icon: User },
],
};

// Kept for the Profile page's "Become a Reviewer" entry point (not in nav).
export const APPLY_REVIEWER = {
  label: "Become a Reviewer",
  href: "/user/apply-reviewer",
  icon: UserPlus,
} satisfies NavItem;

/**
 * Returns the href of the single nav item to highlight for a pathname: the
 * longest item href that is the path itself or a parent of it. Prevents
 * "/user" staying active while on "/user/tasks".
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
