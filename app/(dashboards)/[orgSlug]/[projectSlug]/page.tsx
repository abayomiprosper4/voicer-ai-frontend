"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { 
  useOrganizations, 
  useProjects, 
  useTasks, 
  useProjectMembers, 
  useReviewQueue 
} from "@/lib/api/queries";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, ListChecks, Activity, ShieldCheck, ArrowRight, UserPlus, FileAudio } from "lucide-react";

export default function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string }>;
}) {
  const { orgSlug, projectSlug } = use(params);

  const { data: orgs, isLoading: orgsLoading } = useOrganizations();
  
  // Find the org that matches the slug or ID
  const org = orgs?.find(o => 
    (o.id === orgSlug) || 
    (o.slug === orgSlug) || 
    (o.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === orgSlug)
  );

  const { data: projects, isLoading: projectsLoading } = useProjects(org?.id);
  
  // Find the specific project by slug or ID
  const project = projects?.find(p => 
    (p.id === projectSlug) || 
    (p.slug === projectSlug) || 
    (p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === projectSlug)
  );

  // Fetch aggregate data
  const { data: tasks, isLoading: tasksLoading } = useTasks(project?.id as string);
  const { data: members, isLoading: membersLoading } = useProjectMembers(project?.id as string);
  const { data: reviewQueue, isLoading: reviewsLoading } = useReviewQueue(project?.id as string);

  const activeMembersCount = useMemo(() => {
    if (!members) return 0;
    // members endpoint returns both members and pendingInvitations, members are in data.members
    // but the API might return it wrapped or as array. Let's safely check.
    const memberArray = Array.isArray(members) ? members : members?.members || [];
    return memberArray.length;
  }, [members]);

  if (orgsLoading || projectsLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!org || !project) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-2xl font-semibold">Project not found</h2>
        <p className="text-muted-foreground">The project may not exist or you do not have permission to view it.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Project Header Info */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{project.name}</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {project.description || "No description provided for this project."}
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <Link href={`/${orgSlug}/${projectSlug}/tasks`}>
            <Button variant="outline" className="gap-2">
              <FileAudio className="h-4 w-4" />
              Manage Tasks
            </Button>
          </Link>
          <Link href={`/${orgSlug}/${projectSlug}/members`}>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Members
            </Button>
          </Link>
        </div>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasksLoading ? <Skeleton className="h-8 w-12" /> : tasks?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Target audio prompts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {membersLoading ? <Skeleton className="h-8 w-12" /> : activeMembersCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Contributors & admins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviewsLoading ? <Skeleton className="h-8 w-12" /> : reviewQueue?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting moderation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Status</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">Active</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ends {project.endDate ? new Date(project.endDate).toLocaleDateString() : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions / Getting Started */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Data Collection</CardTitle>
            <CardDescription>View available tasks and contribute voice recordings to the dataset.</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-4">
            <Link href={`/${orgSlug}/${projectSlug}/available`}>
              <Button variant="secondary" className="w-full justify-between">
                Start Recording <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Quality Assurance</CardTitle>
            <CardDescription>Listen to submitted recordings and approve or reject them based on quality.</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-4">
            <Link href={`/${orgSlug}/${projectSlug}/queue`}>
              <Button variant="secondary" className="w-full justify-between">
                Review Submissions <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
