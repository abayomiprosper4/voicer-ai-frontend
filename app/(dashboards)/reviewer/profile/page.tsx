import { User } from "lucide-react";
import { PagePlaceholder } from "@/components/dashboard/PagePlaceholder";

export default function ProfilePage() {
  return (
    <PagePlaceholder
      icon={<User className="h-7 w-7" />}
      title="Profile"
      description="Manage your account details here."
    />
  );
}
