import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, FileArchive, Users } from "lucide-react";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string }>;
}) {
  const { orgSlug, projectSlug } = await params;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage project settings, dataset exports, and members.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileArchive className="h-5 w-5" />
              Dataset Export
            </CardTitle>
            <CardDescription>
              Package and download the audio data and metadata transcriptions collected in this project.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href={`/${orgSlug}/${projectSlug}/settings/export`}>
              <Button className="w-full justify-between">
                Go to Export Engine <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Members
            </CardTitle>
            <CardDescription>
              Manage project contributors and reviewers, and send invitations.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href={`/${orgSlug}/${projectSlug}/members`}>
              <Button variant="secondary" className="w-full justify-between">
                Manage Members <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
