"use client";
import { LogoLoader } from "@/components/ui/logo-loader";
import { useState, use } from "react";
import Link from "next/link";
import { useOrganizations, useProjects, useCreateProject, useLanguages } from "@/lib/api/queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FolderKanban, Plus, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OrganizationPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = use(params);
  const { data: orgs } = useOrganizations();
  
  // Find the org that matches the slug or ID
  const org = orgs?.find(o => 
    (o.id === orgSlug) || 
    (o.slug === orgSlug) || 
    (o.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === orgSlug)
  );
  
  const { data: projects, isLoading, error } = useProjects(org?.id || orgSlug);
  const { data: languages } = useLanguages();
  const createProject = useCreateProject();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    languageId: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.languageId) return;

    const payload: any = { 
      organizationId: org?.id || orgSlug,
      name: formData.name, 
      languages: [formData.languageId],
      startDate: formData.startDate,
      endDate: formData.endDate,
    };
    if (formData.description.trim()) payload.description = formData.description.trim();

    createProject.mutate(
      payload,
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setFormData({ ...formData, name: "", description: "", languageId: "" });
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
        <p className="text-destructive mb-4">Failed to load projects.</p>
      </div>
    );
  }

  const hasProjects = projects && projects.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your datasets and collection workflows.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button className="gap-2" type="button">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateProject}>
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
                <DialogDescription>
                  Start a new data collection initiative.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Yoruba Speech Collection"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={createProject.isPending}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Briefly describe the goal..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={createProject.isPending}
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Target Language</Label>
                  <Select
                    value={formData.languageId}
                    onValueChange={(val) => setFormData({ ...formData, languageId: val || "" })}
                    disabled={createProject.isPending}
                    required
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select a language">
                        {languages?.find((l: any) => l.id === formData.languageId)?.name || formData.languageId}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {languages?.map((lang: any) => (
                        <SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>
                      ))}
                      {(!languages || languages.length === 0) && (
                        <SelectItem value="none" disabled>No languages available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      disabled={createProject.isPending}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={createProject.isPending}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createProject.isPending}>
                  {createProject.isPending && <LogoLoader className="mr-2 h-4 w-4" />}
                  Create Project
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!hasProjects ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-muted/20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <FolderKanban className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No projects found</h2>
          <p className="text-muted-foreground max-w-sm mb-6">
            There are no projects in this organization yet. Create your first project to start.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline">
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project: any) => (
            <Link key={project.id} href={`/${orgSlug}/${project.id}`}>
              <Card className="hover:border-foreground/50 transition-colors cursor-pointer h-full group flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted group-hover:bg-foreground group-hover:text-background transition-colors">
                      <FolderKanban className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                  <CardTitle className="mt-4">{project.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      {new Date(project.startDate || Date.now()).toLocaleDateString()}
                    </span>
                    <span className="flex-1"></span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
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
