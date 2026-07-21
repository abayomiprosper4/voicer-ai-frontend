"use client";
import { LogoLoader } from "@/components/ui/logo-loader";
import { useState, useEffect } from "react";
import { useLanguages, useUserLanguages, useUpdateUserLanguages, useAuthMe } from "@/lib/api/queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {  Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GlobalSettingsPage() {
  const { data: user } = useAuthMe();
  const { data: globalLanguages, isLoading: langLoading } = useLanguages();
  const { data: userLanguages, isLoading: userLangLoading } = useUserLanguages();
  const updateLanguages = useUpdateUserLanguages();

  const [localLangs, setLocalLangs] = useState<{ languageId: string; proficiency: string }[]>([]);

  useEffect(() => {
    if (userLanguages && Array.isArray(userLanguages)) {
      setLocalLangs(userLanguages.map((l: any) => ({
        languageId: l.language?.id || l.languageId,
        proficiency: l.proficiency
      })));
    }
  }, [userLanguages]);

  const addLanguage = () => {
    setLocalLangs([...localLangs, { languageId: "", proficiency: "BASIC" }]);
  };

  const removeLanguage = (index: number) => {
    setLocalLangs(localLangs.filter((_, i) => i !== index));
  };

  const updateLanguage = (index: number, field: string, value: string) => {
    const updated = [...localLangs];
    updated[index] = { ...updated[index], [field]: value };
    setLocalLangs(updated);
  };

  const handleSave = () => {
    const validLangs = localLangs.filter(l => l.languageId !== "");
    updateLanguages.mutate({ languages: validLangs });
  };

  if (langLoading || userLangLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <LogoLoader className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Account Settings</h1>
        <p className="text-muted-foreground">Manage your personal profile and language proficiencies.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal identity on Voicer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-base font-semibold">{user?.firstName} {user?.lastName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base font-semibold">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Language Proficiencies</CardTitle>
              <CardDescription className="mt-1">
                Set your languages to receive relevant recording and review tasks.
              </CardDescription>
            </div>
            <Button onClick={addLanguage} variant="outline" size="sm" className="gap-2 shrink-0">
              <Plus className="h-4 w-4" /> Add Language
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {localLangs.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm border border-dashed rounded-lg">
                You haven't added any languages yet.
              </div>
            ) : (
              <div className="space-y-4">
                {localLangs.map((lang, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <Label className="sr-only">Language</Label>
                      <Select
                        value={lang.languageId}
                        onValueChange={(val) => updateLanguage(idx, 'languageId', val || "")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language">
                            {globalLanguages?.find((gl: any) => gl.id === lang.languageId)?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {globalLanguages?.map((gl: any) => (
                            <SelectItem key={gl.id} value={gl.id}>{gl.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="sr-only">Proficiency</Label>
                      <Select
                        value={lang.proficiency}
                        onValueChange={(val) => updateLanguage(idx, 'proficiency', val || "")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select proficiency">
                            {lang.proficiency === 'BASIC' ? 'Basic' : 
                             lang.proficiency === 'INTERMEDIATE' ? 'Intermediate' : 
                             lang.proficiency === 'ADVANCED' ? 'Advanced' : 
                             lang.proficiency === 'NATIVE' ? 'Native / Fluent' : ''}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BASIC">Basic</SelectItem>
                          <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                          <SelectItem value="ADVANCED">Advanced</SelectItem>
                          <SelectItem value="NATIVE">Native / Fluent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeLanguage(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="text-sm text-emerald-500 flex items-center gap-1.5 opacity-0 transition-opacity" style={{ opacity: updateLanguages.isSuccess ? 1 : 0 }}>
                <CheckCircle2 className="h-4 w-4" />
                Saved successfully
              </div>
              <Button onClick={handleSave} disabled={updateLanguages.isPending || localLangs.length === 0}>
                {updateLanguages.isPending && <LogoLoader className="mr-2 h-4 w-4" />}
                Save Languages
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
