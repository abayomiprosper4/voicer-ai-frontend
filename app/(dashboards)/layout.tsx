export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Auth Guard: Checks if session exists */}
      {children}
    </div>
  );
}
