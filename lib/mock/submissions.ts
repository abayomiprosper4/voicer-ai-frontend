/**
 * In-memory mock submissions so Dashboard / My Submissions are populated
 * before the API exists (PRD §8.4 / §8.7). Swap for a real fetch later —
 * keep the `Submission` shape stable.
 */

import type { TaskType, TaskLanguage } from "./tasks";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type Submission = {
  id: string;
  type: TaskType;
  language: TaskLanguage;
  prompt: string;
  durationSecs: number;
  status: SubmissionStatus;
  /** Relative time label as shown in Figma (kept as a string for the mock). */
  when: string;
};

const SUBMISSIONS: Submission[] = [
  {
    id: "s1",
    type: "read",
    language: "Yoruba",
    prompt: "Mo n lọ sí ilé",
    durationSecs: 5,
    status: "pending",
    when: "2 hours ago",
  },
  {
    id: "s2",
    type: "spontaneous",
    language: "Pidgin",
    prompt: "Yarn us the food wey you like",
    durationSecs: 20,
    status: "approved",
    when: "Yesterday",
  },
  {
    id: "s3",
    type: "read",
    language: "English",
    prompt: "I'm going to the market",
    durationSecs: 7,
    status: "rejected",
    when: "2 hours ago",
  },
  {
    id: "s4",
    type: "spontaneous",
    language: "Yoruba",
    prompt: "Iwe idanwo wo le ni lati ka",
    durationSecs: 8,
    status: "pending",
    when: "2 hours ago",
  },
  {
    id: "s5",
    type: "read",
    language: "English",
    prompt: "I am going to the market",
    durationSecs: 6,
    status: "approved",
    when: "3 days ago",
  },
  {
    id: "s6",
    type: "spontaneous",
    language: "English",
    prompt: "Describe your morning routine",
    durationSecs: 42,
    status: "approved",
    when: "Last week",
  },
];

export type SubmissionStats = {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
};

// Matches the (internally consistent) "My Submissions" Figma frame: 8+3+1=12.
const STATS: SubmissionStats = {
  total: 12,
  approved: 8,
  pending: 3,
  rejected: 1,
};

export function getSubmissions(): Submission[] {
  return SUBMISSIONS;
}

export function getRecentSubmissions(n = 2): Submission[] {
  return SUBMISSIONS.slice(0, n);
}

export function getSubmissionStats(): SubmissionStats {
  return STATS;
}

/** Mock signed-in contributor (until auth lands). */
export const CURRENT_USER = { firstName: "Vivian" };
