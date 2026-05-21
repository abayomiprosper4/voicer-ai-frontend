import { Bell } from "lucide-react";
import { PagePlaceholder } from "@/components/dashboard/PagePlaceholder";

export default function NotificationsPage() {
  return (
    <PagePlaceholder
      icon={<Bell className="h-7 w-7" />}
      title="Notifications"
      description="You're all caught up. Notifications about your submissions and reviews will appear here."
    />
  );
}
