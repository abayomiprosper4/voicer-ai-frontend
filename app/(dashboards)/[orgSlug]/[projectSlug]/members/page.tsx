"use client";
import { LogoLoader } from "@/components/ui/logo-loader";
import { useState, use } from "react";
import { useProjectMembers, useInviteMember } from "@/lib/api/queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Mail, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MembersPage({ params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = use(params);
  const { data: membersData, isLoading, error } = useProjectMembers(projectSlug);
  const inviteMember = useInviteMember();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ email: "", role: "CONTRIBUTOR" });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) return;

    inviteMember.mutate(
      { projectId: projectSlug, email: formData.email, role: formData.role },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setFormData({ email: "", role: "CONTRIBUTOR" });
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
        <p className="text-destructive mb-4">Failed to load members.</p>
      </div>
    );
  }

  const activeMembers = membersData?.members || [];
  const pendingInvites = (membersData?.pendingInvitations || []).map((inv: any) => ({
    ...inv,
    status: 'PENDING'
  }));
  
  const allMembers = [...activeMembers, ...pendingInvites];
  const hasMembers = allMembers.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Members & Roles</h1>
          <p className="text-muted-foreground mt-1">Manage team access and reviewer permissions for this project.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button className="gap-2 shrink-0" type="button" />}>
            <Mail className="h-4 w-4" />
            Invite Member
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleInvite}>
              <DialogHeader>
                <DialogTitle>Invite to Project</DialogTitle>
                <DialogDescription>
                  Send an email invitation to join this project team.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={inviteMember.isPending}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(val) => setFormData({ ...formData, role: val || "" })}
                    disabled={inviteMember.isPending}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROJECT_ADMIN">Project Admin</SelectItem>
                      <SelectItem value="REVIEWER">Reviewer</SelectItem>
                      <SelectItem value="CONTRIBUTOR">Contributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={inviteMember.isPending}>
                  {inviteMember.isPending && <LogoLoader className="mr-2 h-4 w-4" />}
                  Send Invitation
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hasMembers ? (
                allMembers.map((member: any) => (
                  <tr key={member.id || member.email} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold uppercase">
                          {(member.user?.firstName?.[0] || member.email?.[0] || "?")}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {member.user ? `${member.user.firstName} ${member.user.lastName}` : member.email}
                          </div>
                          {member.user && <div className="text-xs text-muted-foreground">{member.user.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-background text-muted-foreground">
                        {member.role === 'PROJECT_ADMIN' ? 'Admin' : member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {member.status === 'PENDING' ? (
                        <span className="flex items-center gap-1.5 text-amber-500 font-medium">
                          <Clock className="h-4 w-4" /> Pending
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                          <CheckCircle2 className="h-4 w-4" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    No members found. Invite some colleagues to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
