import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { components } from "./types";

export const queryKeys = {
  organizations: {
    all: ["organizations"] as const,
    detail: (id: string) => ["organizations", id] as const,
  },
  projects: {
    all: (orgId?: string) => ["projects", orgId] as const,
    detail: (id: string) => ["projects", "detail", id] as const,
  },
  tasks: {
    all: (projectId: string) => ["tasks", projectId] as const,
  }
};

// Helper type to unwrap the backend's standard SuccessResponse wrapper
type WrappedResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

// --- Auth ---

export function useAuthMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await apiClient.get<WrappedResponse<any>>("/auth/me");
      return res.data.data || res.data;
    },
    retry: false, // Don't retry auth failures, let middleware or interceptor handle it
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (body: components["schemas"]["LoginBody"]) => {
      const res = await apiClient.post<WrappedResponse<{ token: string; user: any }>>("/auth/login", body);
      return res.data.data || res.data;
    },
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      }
    }
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (body: components["schemas"]["RegisterBody"]) => {
      const res = await apiClient.post<WrappedResponse<any>>("/auth/register", body);
      return res.data.data || res.data;
    }
  });
}

// --- Organizations ---

export function useOrganizations() {
  return useQuery({
    queryKey: queryKeys.organizations.all,
    queryFn: async () => {
      // The openapi schema shows responses usually wrap data in `data`
      const res = await apiClient.get<WrappedResponse<any[]>>("/organizations");
      return res.data.data || res.data;
    },
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: components["schemas"]["CreateOrgBody"]) => {
      const res = await apiClient.post<WrappedResponse<any>>("/organizations", body);
      return res.data.data || res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
    },
  });
}

// --- Projects ---

export function useProjects(organizationId?: string) {
  return useQuery({
    queryKey: queryKeys.projects.all(organizationId),
    queryFn: async () => {
      const res = await apiClient.get<WrappedResponse<any[]>>("/projects", {
        params: { organizationId }
      });
      return res.data.data || res.data;
    },
    enabled: !!organizationId, // Only fetch if we have an orgId
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: components["schemas"]["CreateProjectBody"]) => {
      const res = await apiClient.post<WrappedResponse<any>>("/projects", body);
      return res.data.data || res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all(variables.organizationId) });
    },
  });
}

// --- Languages ---
export function useLanguages() {
  return useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const res = await apiClient.get<WrappedResponse<any[]>>("/languages");
      return res.data.data || res.data;
    }
  });
}

export function useUserLanguages() {
  return useQuery({
    queryKey: ["languages", "user"],
    queryFn: async () => {
      const res = await apiClient.get<WrappedResponse<any>>("/languages/user");
      return res.data.data || res.data;
    }
  });
}

export function useUpdateUserLanguages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { languages: { languageId: string; proficiency: string }[] }) => {
      const res = await apiClient.post<WrappedResponse<any>>("/languages/user", body);
      return res.data.data || res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["languages", "user"] });
    },
  });
}

// --- Members ---
export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: ["members", projectId],
    queryFn: async () => {
      const res = await apiClient.get<WrappedResponse<any>>(`/members/projects/${projectId}`);
      return res.data.data || res.data;
    },
    enabled: !!projectId,
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { projectId: string; email: string; role: string }) => {
      const res = await apiClient.post<WrappedResponse<any>>("/members/invite", body);
      return res.data.data || res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members", variables.projectId] });
    },
  });
}

// --- Tasks ---
export function useTasks(projectId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.all(projectId),
    queryFn: async () => {
      const res = await apiClient.get<WrappedResponse<any[]>>("/tasks", {
        params: { projectId }
      });
      return res.data.data || res.data;
    },
    enabled: !!projectId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: components["schemas"]["CreateTaskBody"]) => {
      const res = await apiClient.post<WrappedResponse<any>>("/tasks", body);
      return res.data.data || res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all(variables.projectId) });
    },
  });
}

// --- Task Detail ---
export function useTaskDetail(taskId: string) {
  return useQuery({
    queryKey: ["tasks", "detail", taskId],
    queryFn: async () => {
      const res = await apiClient.get<WrappedResponse<any>>(`/tasks/${taskId}`);
      return res.data.data || res.data;
    },
    enabled: !!taskId,
  });
}

// --- Contributor Available Tasks ---
export function useAvailableTasks(projectId: string) {
  return useQuery({
    queryKey: ["tasks", "contributor", "available", projectId],
    queryFn: async () => {
      const res = await apiClient.get<WrappedResponse<any[]>>("/tasks/contributor/available", {
        params: { projectId },
      });
      return res.data.data || res.data;
    },
    enabled: !!projectId,
  });
}

// --- Submissions ---
export function useRequestUploadUrl() {
  return useMutation({
    mutationFn: async (body: components["schemas"]["RequestUploadUrlBody"]) => {
      const res = await apiClient.post<WrappedResponse<{ uploadUrl: string; storagePath: string }>>(
        "/submissions/upload-url",
        body
      );
      return res.data.data || res.data;
    },
  });
}

export function useCreateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: components["schemas"]["CreateSubmissionBody"]) => {
      const res = await apiClient.post<WrappedResponse<any>>("/submissions", body);
      return res.data.data || res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "contributor", "available"] });
    },
  });
}

export function useContributorHistory(projectId?: string, status?: string) {
  return useQuery({
    queryKey: ["submissions", "contributor", "history", projectId, status],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (projectId) params.projectId = projectId;
      if (status) params.status = status;
      const res = await apiClient.get<WrappedResponse<any[]>>("/submissions/contributor/history", {
        params,
      });
      return res.data.data || res.data;
    },
  });
}

export function useSubmissionDetail(submissionId: string) {
  return useQuery({
    queryKey: ["submissions", "detail", submissionId],
    queryFn: async () => {
      const res = await apiClient.get<WrappedResponse<any>>(`/submissions/${submissionId}`);
      return res.data.data || res.data;
    },
    enabled: !!submissionId,
  });
}

// --- Reviews ---
export function useReviewQueue(projectId: string) {
  return useQuery({
    queryKey: ["reviews", "queue", projectId],
    queryFn: async () => {
      const res = await apiClient.get<WrappedResponse<any[]>>("/reviews/queue", {
        params: { projectId },
      });
      return res.data.data || res.data;
    },
    enabled: !!projectId,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: components["schemas"]["CreateReviewBody"]) => {
      const res = await apiClient.post<WrappedResponse<any>>("/reviews", body);
      return res.data.data || res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "queue"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "reviewer", "history"] });
    },
  });
}

export function useReviewerHistory(projectId?: string) {
  return useQuery({
    queryKey: ["reviews", "reviewer", "history", projectId],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (projectId) params.projectId = projectId;
      const res = await apiClient.get<WrappedResponse<any[]>>("/reviews/reviewer/history", {
        params,
      });
      return res.data.data || res.data;
    },
  });
}

// --- Exports ---
export function useRequestExport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: components["schemas"]["CreateExportBody"]) => {
      const res = await apiClient.post<WrappedResponse<{ exportId: string }>>("/exports", body);
      return res.data.data || res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exports"] });
    },
  });
}

export function useExports(projectId: string) {
  return useQuery({
    queryKey: ["exports", "list", projectId],
    queryFn: async () => {
      const res = await apiClient.get<WrappedResponse<any[]>>("/exports", {
        params: { projectId }
      });
      return res.data.data || res.data;
    },
    enabled: !!projectId,
  });
}

export function useExportStatus(exportId: string | null) {
  return useQuery({
    queryKey: ["exports", "detail", exportId],
    queryFn: async () => {
      const res = await apiClient.get<WrappedResponse<any>>(`/exports/${exportId}`);
      return res.data.data || res.data;
    },
    enabled: !!exportId,
    refetchInterval: (query) => {
      const data = query.state.data as any;
      if (data && data.status !== "READY" && data.status !== "FAILED") {
        return 3000;
      }
      return false;
    }
  });
}

export function useExportDownload(exportId: string | null) {
  return useQuery({
    queryKey: ["exports", "download", exportId],
    queryFn: async () => {
      const res = await apiClient.get<WrappedResponse<{ downloadUrl: string }>>(`/exports/${exportId}/download`);
      return res.data.data || res.data;
    },
    enabled: !!exportId,
  });
}
