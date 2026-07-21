"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic } from "lucide-react";
import { useCreateOrganization } from "@/lib/api/queries";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const createOrg = useCreateOrganization();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("orgName") as string;
    const organizationType = formData.get("orgType") as string;
    const country = formData.get("country") as string;
    
    createOrg.mutate({
      name,
      organizationType,
      country,
    }, {
      onSuccess: (data) => {
        // Fallback to name-based slug if backend doesn't return one
        const orgSlug = data?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        // Redirect to a dashboard overview or demo project
        router.push(`/${orgSlug}/overview`);
      },
      onError: (err) => {
        console.error("Failed to create organization", err);
        alert("Failed to create organization. Please try again.");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Mic className="h-6 w-6" />
          </span>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            Voicer
          </span>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Create an Organization</CardTitle>
            <CardDescription>
              Set up your organization to start creating speech data collection projects.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" name="orgName" placeholder="Acme Corp" required disabled={createOrg.isPending} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgType">Organization Type</Label>
                <Select name="orgType" required disabled={createOrg.isPending}>
                  <SelectTrigger id="orgType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="research">Research Institution</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="ngo">NGO</SelectItem>
                    <SelectItem value="government">Government Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" placeholder="e.g. Nigeria" required disabled={createOrg.isPending} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={createOrg.isPending}>
                {createOrg.isPending ? "Creating..." : "Create Organization"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
