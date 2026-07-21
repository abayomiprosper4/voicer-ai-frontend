"use client";
import { LogoLoader } from "@/components/ui/logo-loader";
import { useState } from "react";
import Link from "next/link";
import { useOrganizations, useCreateOrganization } from "@/lib/api/queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Plus, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function DashboardPage() {
  const { data: organizations, isLoading, error } = useOrganizations();
  const createOrg = useCreateOrganization();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orgName, setOrgName] = useState("");

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;

    createOrg.mutate(
      { name: orgName },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setOrgName("");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <LogoLoader className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Failed to load organizations.</p>
      </div>
    );
  }

  const hasOrgs = organizations && organizations.length > 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Organizations</h1>
          <p className="text-muted-foreground mt-1">Select an organization to access its projects.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button className="gap-2" type="button">
              <Plus className="h-4 w-4" />
              New Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateOrg}>
              <DialogHeader>
                <DialogTitle>Create Organization</DialogTitle>
                <DialogDescription>
                  Set up a new organization to manage your data collection projects.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Acme Research Labs"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    disabled={createOrg.isPending}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createOrg.isPending}>
                  {createOrg.isPending && <LogoLoader className="mr-2 h-4 w-4" />}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!hasOrgs ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-muted/20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No organizations yet</h2>
          <p className="text-muted-foreground max-w-sm mb-6">
            You don't belong to any organizations. Create one to start building audio datasets.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline">
            Create your first organization
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((org: any) => (
            <Link key={org.id} href={`/${org.id}`}>
              <Card className="hover:border-foreground/50 transition-colors cursor-pointer h-full group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted group-hover:bg-foreground group-hover:text-background transition-colors">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                  <CardTitle className="mt-4">{org.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {org.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      Active
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
