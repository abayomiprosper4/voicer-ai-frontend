import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <Logo className="h-6 w-6 text-primary" />
        <span className="font-bold tracking-tight">Voicer</span>
      </div>
      
      <div className="space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-8xl font-black text-primary/20 select-none">404</h1>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Page not found</h2>
          <p className="text-muted-foreground">
            The link you followed may be broken, or the page may have been removed. 
            If you are looking for a specific project, double-check the URL.
          </p>
        </div>
        
        <div className="pt-4 flex justify-center">
          <Link href="/">
            <Button size="lg" className="gap-2 rounded-full px-8">
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Voicer. All rights reserved.
      </div>
    </div>
  );
}
