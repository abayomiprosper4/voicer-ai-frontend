import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PagePlaceholder } from "@/components/dashboard/PagePlaceholder";

export default function ProfilePage() {
  return (
    <PagePlaceholder
      icon={<User className="h-7 w-7" />}
      title="Profile"
      description="Manage your account details here. You can also apply to become a reviewer."
      action={
        <Button asChild variant="cta" size="pill">
          {/* <Link href="/user/apply-reviewer">Become a Reviewer</Link> */}
        </Button>
      }
    />
  );
}
