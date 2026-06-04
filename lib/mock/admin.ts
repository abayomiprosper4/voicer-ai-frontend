/**
 * In-memory mock data for the admin dashboard screens.
 * Matches the Figma admin designs. Swap for real API later.
 */

import type { SubmissionStatus } from "./submissions";

/* ── Dashboard stats ──────────────────────────────────────────────── */

export type AdminStats = {
  totalUsers: number;
  totalProjects: number;
  totalReviewers: number;
};

export function getAdminStats(): AdminStats {
  return { totalUsers: 30, totalProjects: 30, totalReviewers: 30 };
}

/* ── Reviewer activity table ──────────────────────────────────────── */

export type ReviewerActivity = {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  status: SubmissionStatus;
};

const REVIEWER_ACTIVITY: ReviewerActivity[] = [
  { id: "ra1", name: "Vivian Okechukwu", email: "vivianokechukwu19@gmail.com", dateJoined: "10-05-26", status: "approved" },
  { id: "ra2", name: "Vivian Okechukwu", email: "vivianokechukwu19@gmail.com", dateJoined: "10-05-26", status: "approved" },
  { id: "ra3", name: "Vivian Okechukwu", email: "vivianokechukwu19@gmail.com", dateJoined: "10-05-26", status: "pending" },
  { id: "ra4", name: "Vivian Okechukwu", email: "vivianokechukwu19@gmail.com", dateJoined: "10-05-26", status: "approved" },
  { id: "ra5", name: "Vivian Okechukwu", email: "vivianokechukwu19@gmail.com", dateJoined: "10-05-26", status: "rejected" },
  { id: "ra6", name: "Vivian Okechukwu", email: "vivianokechukwu19@gmail.com", dateJoined: "10-05-26", status: "approved" },
  { id: "ra7", name: "Vivian Okechukwu", email: "vivianokechukwu19@gmail.com", dateJoined: "10-05-26", status: "rejected" },
  { id: "ra8", name: "Vivian Okechukwu", email: "vivianokechukwu19@gmail.com", dateJoined: "10-05-26", status: "approved" },
  { id: "ra9", name: "Vivian Okechukwu", email: "vivianokechukwu19@gmail.com", dateJoined: "10-05-26", status: "pending" },
  { id: "ra10", name: "Vivian Okechukwu", email: "vivianokechukwu19@gmail.com", dateJoined: "10-05-26", status: "approved" },
];

export function getReviewerActivity(): ReviewerActivity[] {
  return REVIEWER_ACTIVITY;
}

/* ── Submission trends chart data ─────────────────────────────────── */

/** Line chart: Monday–Friday submissions per week (3 series). */
export type TrendPoint = { day: number; seriesA: number; seriesB: number; seriesC: number };

export function getSubmissionTrends(): TrendPoint[] {
  return [
    { day: 0, seriesA: 16, seriesB: 12, seriesC: 20 },
    { day: 1, seriesA: 24, seriesB: 18, seriesC: 22 },
    { day: 2, seriesA: 20, seriesB: 28, seriesC: 14 },
    { day: 3, seriesA: 8, seriesB: 16, seriesC: 10 },
    { day: 4, seriesA: 14, seriesB: 10, seriesC: 6 },
    { day: 5, seriesA: 10, seriesB: 6, seriesC: 8 },
  ];
}

/** Bar chart: language distribution per category. */
export type LangDistribution = {
  category: number;
  english: number;
  yoruba: number;
  pidgin: number;
  other: number;
};

export function getLanguageDistribution(): LangDistribution[] {
  return [
    { category: 0, english: 40, yoruba: 60, pidgin: 30, other: 100 },
    { category: 1, english: 60, yoruba: 50, pidgin: 25, other: 80 },
    { category: 2, english: 50, yoruba: 75, pidgin: 10, other: 50 },
    { category: 3, english: 20, yoruba: 10, pidgin: 5, other: 15 },
    { category: 4, english: 70, yoruba: 50, pidgin: 40, other: 85 },
    { category: 5, english: 40, yoruba: 60, pidgin: 30, other: 55 },
  ];
}

/* ── Past projects table ──────────────────────────────────────────── */

export type PastProject = {
  id: string;
  reviewer: string;
  project: "Read Speech" | "Spontaneous Speech";
  dateCreated: string;
  status: SubmissionStatus;
};

const PAST_PROJECTS: PastProject[] = [
  { id: "pp1", reviewer: "Vivian Okechukwu", project: "Read Speech", dateCreated: "10-05-26", status: "approved" },
  { id: "pp2", reviewer: "Vivian Okechukwu", project: "Spontaneous Speech", dateCreated: "10-05-26", status: "approved" },
  { id: "pp3", reviewer: "Vivian Okechukwu", project: "Read Speech", dateCreated: "10-05-26", status: "pending" },
  { id: "pp4", reviewer: "Vivian Okechukwu", project: "Read Speech", dateCreated: "10-05-26", status: "approved" },
  { id: "pp5", reviewer: "Vivian Okechukwu", project: "Read Speech", dateCreated: "10-05-26", status: "rejected" },
  { id: "pp6", reviewer: "Vivian Okechukwu", project: "Spontaneous Speech", dateCreated: "10-05-26", status: "approved" },
  { id: "pp7", reviewer: "Vivian Okechukwu", project: "Spontaneous Speech", dateCreated: "10-05-26", status: "rejected" },
  { id: "pp8", reviewer: "Vivian Okechukwu", project: "Spontaneous Speech", dateCreated: "10-05-26", status: "approved" },
  { id: "pp9", reviewer: "Vivian Okechukwu", project: "Spontaneous Speech", dateCreated: "10-05-26", status: "pending" },
  { id: "pp10", reviewer: "Vivian Okechukwu", project: "Spontaneous Speech", dateCreated: "10-05-26", status: "approved" },
];

export function getPastProjects(): PastProject[] {
  return PAST_PROJECTS;
}

/** Extend array for pagination demo (repeats to fill 12 pages). */
export function getPastProjectsPaginated(page: number, perPage = 10): {
  data: PastProject[];
  total: number;
  totalPages: number;
} {
  // Generate enough data for 12 pages
  const allData: PastProject[] = [];
  for (let i = 0; i < 12; i++) {
    allData.push(
      ...PAST_PROJECTS.map((p) => ({
        ...p,
        id: `${p.id}-page${i}`,
      })),
    );
  }
  const total = allData.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  return {
    data: allData.slice(start, start + perPage),
    total,
    totalPages,
  };
}

/* ── Users / Reviewers list ──────────────────────────────────────── */

export type UserRow = {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  status: SubmissionStatus;
};

export function getUsersPaginated(page: number, perPage = 10) {
  const data = getReviewerActivity().map((r) => ({ ...r, id: `u-${r.id}` }));
  return generatePaginated(data, page, perPage);
}

export function getReviewersPaginated(page: number, perPage = 10) {
  const data = getReviewerActivity().map((r) => ({ ...r, id: `r-${r.id}` }));
  return generatePaginated(data, page, perPage);
}

/* ── Assignments ─────────────────────────────────────────────────── */

export type AssignmentRow = {
  id: string;
  projectName: string;
  owner: string;
  dateCreated: string;
  status: SubmissionStatus;
};

const ASSIGNMENTS: AssignmentRow[] = [
  { id: "a1", projectName: "Yoruba Read Speech", owner: "Vivian (R)", dateCreated: "10-05-26", status: "approved" },
  { id: "a2", projectName: "Pidgin Spontaneous Speech", owner: "Matthew (C)", dateCreated: "10-05-26", status: "approved" },
  { id: "a3", projectName: "English Read Speech", owner: "Yusuf (R)", dateCreated: "10-05-26", status: "pending" },
  { id: "a4", projectName: "Pidgin Read Speech", owner: "Vivian (R)", dateCreated: "10-05-26", status: "approved" },
  { id: "a5", projectName: "Yoruba Spontaneous Speech", owner: "Vivian (R)", dateCreated: "10-05-26", status: "rejected" },
  { id: "a6", projectName: "English Read Speech", owner: "Matthew (C)", dateCreated: "10-05-26", status: "approved" },
  { id: "a7", projectName: "Pidgin Read Speech", owner: "Matthew (C)", dateCreated: "10-05-26", status: "rejected" },
  { id: "a8", projectName: "Yoruba Spontaneous Speech", owner: "Yusuf (R)", dateCreated: "10-05-26", status: "approved" },
  { id: "a9", projectName: "Pidgin Spontaneous Speech", owner: "Yusuf (R)", dateCreated: "10-05-26", status: "pending" },
  { id: "a10", projectName: "English Read Speech", owner: "Yusuf (R)", dateCreated: "10-05-26", status: "approved" },
];

export function getAssignmentsPaginated(page: number, perPage = 10) {
  return generatePaginated(ASSIGNMENTS, page, perPage);
}

function generatePaginated<T>(source: T[], page: number, perPage: number) {
  const allData: T[] = [];
  for (let i = 0; i < 12; i++) {
    allData.push(
      ...source.map((item: any) => ({
        ...item,
        id: `${item.id}-page${i}`,
      }))
    );
  }
  const total = allData.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  return {
    data: allData.slice(start, start + perPage),
    total,
    totalPages,
  };
}
