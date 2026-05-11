export default function ReviewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Sidebar with: Review Queue, Performance */}
      <aside className="w-64 border-r border-gray-200">
        {/* Reviewer Sidebar */}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
