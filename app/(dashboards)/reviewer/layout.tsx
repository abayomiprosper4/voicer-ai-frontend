import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function ReviewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="reviewer">{children}</DashboardShell>;
}
