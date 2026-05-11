export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Sidebar with: Projects, Users, Applications */}
      <aside className="w-64 border-r border-gray-200">
        {/* Admin Sidebar */}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
