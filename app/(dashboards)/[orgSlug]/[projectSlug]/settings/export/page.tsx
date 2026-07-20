"use client";

import { use, useState, useEffect } from "react";
import { 
  useRequestExport, 
  useExports, 
  useExportStatus, 
  useExportDownload,
  useLanguages
} from "@/lib/api/queries";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FileArchive, Loader2, Download, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ExportDatasetPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string }>;
}) {
  const { orgSlug, projectSlug } = use(params);

  const { data: languages } = useLanguages();
  const requestExport = useRequestExport();
  const { data: exportsList, isLoading: listLoading } = useExports(projectSlug);

  const [formData, setFormData] = useState({
    format: "JSON" as "CSV" | "JSON" | "ZIP",
    approvedOnly: true,
    languageId: "all",
    startDate: "",
    endDate: "",
  });

  const [activeExportId, setActiveExportId] = useState<string | null>(null);
  
  // Polling query
  const { data: activeExport, isError: exportError } = useExportStatus(activeExportId);
  const { refetch: getDownloadUrl } = useExportDownload(activeExportId);

  // If a new export finishes, update our list and handle download
  useEffect(() => {
    if (activeExport?.status === "READY") {
      getDownloadUrl().then((res) => {
        if (res.data?.downloadUrl) {
          window.location.href = res.data.downloadUrl;
        }
      });
      // We can stop polling by clearing the active export ID, 
      // but maybe we want to keep it to show "Success" state briefly.
      setTimeout(() => setActiveExportId(null), 5000);
    } else if (activeExport?.status === "FAILED" || exportError) {
      setTimeout(() => setActiveExportId(null), 5000);
    }
  }, [activeExport?.status, exportError, getDownloadUrl]);

  const handleRequestExport = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: any = {
      projectId: projectSlug,
      format: formData.format,
      approvedOnly: formData.approvedOnly,
    };
    if (formData.languageId !== "all") payload.languageId = formData.languageId;
    if (formData.startDate) payload.startDate = formData.startDate;
    if (formData.endDate) payload.endDate = formData.endDate;

    requestExport.mutate(payload, {
      onSuccess: (res) => {
        if (res?.exportId) {
          setActiveExportId(res.exportId);
        }
      }
    });
  };

  const handleDownloadOldExport = (exportId: string) => {
    setActiveExportId(exportId);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Export Dataset</h1>
        <p className="text-muted-foreground mt-1">Package and download your audio data and transcriptions.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Request Export Form */}
        <Card>
          <form onSubmit={handleRequestExport}>
            <CardHeader>
              <CardTitle>Generate New Export</CardTitle>
              <CardDescription>Select filters for the data you want to export.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select
                  value={formData.format}
                  onValueChange={(val) => setFormData({ ...formData, format: val as any })}
                  disabled={requestExport.isPending || !!activeExportId}
                >
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select a format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JSON">JSON (Metadata only)</SelectItem>
                    <SelectItem value="CSV">CSV (Metadata only)</SelectItem>
                    <SelectItem value="ZIP">ZIP (Metadata + Audio files)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language Filter</Label>
                <Select
                  value={formData.languageId}
                  onValueChange={(val) => setFormData({ ...formData, languageId: val || "" })}
                  disabled={requestExport.isPending || !!activeExportId}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="All Languages">
                      {formData.languageId === "all" ? "All Languages" : 
                       languages?.find((l: any) => l.id === formData.languageId)?.name || formData.languageId}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    {languages?.map((lang: any) => (
                      <SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>
                    ))}
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
                    disabled={requestExport.isPending || !!activeExportId}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    disabled={requestExport.isPending || !!activeExportId}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    checked={formData.approvedOnly}
                    onChange={(e) => setFormData({ ...formData, approvedOnly: e.target.checked })}
                    disabled={requestExport.isPending || !!activeExportId}
                  />
                  Only include Approved submissions
                </Label>
              </div>
            </CardContent>
            
            {/* Active Export Status Banner */}
            {activeExportId && (
              <div className="mx-6 mb-4 p-4 rounded-lg border bg-muted/50 flex flex-col items-center justify-center text-center space-y-2">
                {activeExport?.status === "READY" ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Export Ready! Starting download...</p>
                  </>
                ) : activeExport?.status === "FAILED" || exportError ? (
                  <>
                    <AlertCircle className="h-6 w-6 text-destructive" />
                    <p className="text-sm font-medium text-destructive">Export failed. Please try again.</p>
                  </>
                ) : (
                  <>
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Packaging dataset... This may take a few minutes.
                    </p>
                  </>
                )}
              </div>
            )}

            <CardFooter>
              <Button 
                type="submit" 
                className="w-full gap-2" 
                disabled={requestExport.isPending || !!activeExportId}
              >
                {requestExport.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileArchive className="h-4 w-4" />}
                Generate Export
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Previous Exports List */}
        <Card>
          <CardHeader>
            <CardTitle>Previous Exports</CardTitle>
            <CardDescription>Download recently generated datasets.</CardDescription>
          </CardHeader>
          <CardContent>
            {listLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : !exportsList || exportsList.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileArchive className="h-8 w-8 mx-auto mb-3 opacity-20" />
                No previous exports found.
              </div>
            ) : (
              <div className="space-y-3">
                {exportsList.map((exp: any) => (
                  <div key={exp.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {exp.format} Export
                        {exp.status === "READY" && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                        {exp.status === "FAILED" && <span className="h-2 w-2 rounded-full bg-destructive" />}
                        {exp.status === "PENDING" && <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(exp.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      disabled={exp.status !== "READY" || activeExportId === exp.id}
                      onClick={() => handleDownloadOldExport(exp.id)}
                    >
                      {activeExportId === exp.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
