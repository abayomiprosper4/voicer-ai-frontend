"use client";
import { LogoLoader } from "@/components/ui/logo-loader";
import { useState, use, useEffect } from "react";
import { useTasks, useCreateTask, useLanguages } from "@/lib/api/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ListChecks, Plus, PlayCircle, Settings2, FileAudio } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TASK_TYPES = [
  { value: "READ_PROMPT", label: "Read Prompt", icon: FileAudio },
  { value: "SPONTANEOUS_SPEECH", label: "Spontaneous Speech", icon: PlayCircle },
  { value: "GUIDED_CONVERSATION", label: "Guided Conversation", icon: Settings2 },
];

export default function TasksPage({ params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = use(params);
  const { data: tasks, isLoading, error } = useTasks(projectSlug);
  const { data: languages } = useLanguages();
  const createTask = useCreateTask();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    languageId: "",
    taskType: "READ_PROMPT",
    targetDuration: 30,
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!formData.title.trim()) {
      setFormError("Task title is required.");
      return;
    }
    if (!formData.languageId) {
      setFormError("Please select a target language.");
      return;
    }

    const payload: any = {
      projectId: projectSlug,
      title: formData.title,
      languageId: formData.languageId,
      taskType: formData.taskType as any,
      targetDuration: formData.targetDuration,
    };
    if (formData.description.trim()) payload.description = formData.description.trim();
    if (formData.instructions.trim()) payload.instructions = formData.instructions.trim();

    createTask.mutate(
      payload,
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setFormData({
            title: "",
            description: "",
            instructions: "",
            languageId: "",
            taskType: "READ_PROMPT",
            targetDuration: 30,
          });
        },
      }
    );
  };

  // Auto-select first language if available
  useEffect(() => {
    if (languages && languages.length > 0 && !formData.languageId) {
      setFormData(prev => ({ ...prev, languageId: languages[0].id }));
    }
  }, [languages, formData.languageId]);


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
        <p className="text-destructive mb-4">Failed to load tasks.</p>
      </div>
    );
  }

  const hasTasks = tasks && tasks.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage the specific recording prompts and targets for this project.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button className="gap-2 shrink-0" type="button" />}>
            <Plus className="h-4 w-4" />
            New Task
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleCreateTask}>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>
                  Define a new recording target for contributors.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {formError && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                    {formError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Read Yoruba Market Scene"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    disabled={createTask.isPending}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taskType">Task Type</Label>
                    <Select
                      value={formData.taskType}
                      onValueChange={(val) => setFormData({ ...formData, taskType: val || "" })}
                      disabled={createTask.isPending}
                    >
                      <SelectTrigger id="taskType">
                        <SelectValue placeholder="Select a task type">
                          {TASK_TYPES.find(t => t.value === formData.taskType)?.label}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Target Language</Label>
                    <Select
                      value={formData.languageId}
                      onValueChange={(val) => setFormData({ ...formData, languageId: val || "" })}
                      disabled={createTask.isPending}
                      required
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select a language">
                          {languages?.find((l: any) => l.id === formData.languageId)?.name || 
                           (formData.languageId === "default-uuid" ? "English (Mock)" : formData.languageId)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {languages?.map((lang: any) => (
                          <SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>
                        ))}
                        {(!languages || languages.length === 0) && (
                          <SelectItem value="default-uuid">English (Mock)</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Task Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Briefly describe what this task is..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={createTask.isPending}
                    className="resize-none"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Contributor Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="e.g. Speak clearly at a natural pace..."
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    disabled={createTask.isPending}
                    className="resize-none font-mono text-sm"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetDuration">Target Duration (Seconds)</Label>
                  <Input
                    id="targetDuration"
                    type="number"
                    min="1"
                    value={formData.targetDuration}
                    onChange={(e) => setFormData({ ...formData, targetDuration: parseInt(e.target.value) || 0 })}
                    disabled={createTask.isPending}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createTask.isPending}>
                  {createTask.isPending && <LogoLoader className="mr-2 h-4 w-4" />}
                  Create Task
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
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Language</th>
                <th className="px-6 py-4 font-semibold text-right">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hasTasks ? (
                tasks.map((task: any) => {
                  const typeInfo = TASK_TYPES.find(t => t.value === task.taskType) || TASK_TYPES[0];
                  const Icon = typeInfo.icon;
                  
                  return (
                    <tr key={task.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{task.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-md">
                          {task.description || "No description"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold bg-background text-muted-foreground">
                          <Icon className="h-3 w-3" />
                          {typeInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground">{task.languageId?.substring(0,8) || "Unknown"}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-muted-foreground">
                        {task.targetDuration}s
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <ListChecks className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    No tasks found. Create a new task for your contributors.
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
