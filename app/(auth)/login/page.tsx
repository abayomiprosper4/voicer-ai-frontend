import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-6">

      {/* Centered Auth Card Area */}
      <div className="w-full max-w-md bg-background border border-border p-8 sm:p-12 shadow-sm rounded-xl">
        <AuthForm />
      </div>
    </div>
  );
}
