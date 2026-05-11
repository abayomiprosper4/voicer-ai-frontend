export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Sidebar with: My Tasks, Become a Reviewer */}
      <aside className="w-64 border-r border-gray-200">
        {/* Contributor Sidebar */}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
