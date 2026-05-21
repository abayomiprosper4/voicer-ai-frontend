/**
 * Shared wrapper for every authenticated dashboard (contributor / reviewer /
 * admin). This is the single auth-guard seam: once auth lands, redirect
 * unauthenticated users and enforce role here, before any role layout renders.
 *
 * Visual chrome (sidebar / mobile drawer) lives in each role's own layout via
 * <DashboardShell>, so this stays a pure pass-through for now.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO(auth): const session = await auth(); if (!session) redirect("/login");
  return <>{children}</>;
}
