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
  speakerName: string;
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
    speakerName: "Ada Okafor",
    when: "2 hours ago",
  },
  {
    id: "s2",
    type: "spontaneous",
    language: "Pidgin",
    prompt: "Yarn us the food wey you like",
    durationSecs: 20,
    status: "approved",
    speakerName: "Vivian Okechukwu",
    when: "Yesterday",
  },
  {
    id: "s3",
    type: "read",
    language: "English",
    prompt: "I'm going to the market",
    durationSecs: 7,
    status: "rejected",
    speakerName: "Tunde Akerele",
    when: "2 hours ago",
  },
  {
    id: "s4",
    type: "spontaneous",
    language: "Yoruba",
    prompt: "Iwe idanwo wo le ni lati ka",
    durationSecs: 8,
    status: "pending",
    speakerName: "Victoria Okechukwu",
    when: "2 hours ago",
  },
  {
    id: "s5",
    type: "read",
    language: "English",
    prompt: "I am going to the market",
    durationSecs: 6,
    status: "approved",
    speakerName: "Chioma Nwosu",
    when: "3 days ago",
  },
  {
    id: "s6",
    type: "read",
    language: "English",
    prompt: "The quick brown fox jumps over the lazy dog",
    durationSecs: 42,
    status: "approved",
    speakerName: "Temitope Olutunmida",
    when: "4 days ago",
  },
    {
    id: "s7",
    type: "spontaneous",
    language: "English",
    prompt: "Talk about your favourite hobby",
    durationSecs: 42,
    status: "pending",
    speakerName: "Emeka Igwe",
    when: "Last week",
  },
    {
    id: "s8",
    type: "read",
    language: "Pidgin",
    prompt: "I don dey yarn the guy the matter",
    durationSecs: 42,
    status: "pending",
    speakerName: "Faizah Salisu",
    when: "Last week",
  },
    {
    id: "s9",
    type: "spontaneous",
    language: "English",
    prompt: "Describe your favourite food",
    durationSecs: 42,
    status: "approved",
    speakerName: "Oghenekevwe Omonode",
    when: "Last 2 weeks",
  },
    {
    id: "s10",
    type: "read",
    language: "English",
    prompt: "You can't park there sir",
    durationSecs: 42,
    status: "rejected",
    speakerName: "Alicia Ebbi",
    when: "Last 3 weeks",
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

export function getSubmissionById(id: string): Submission | undefined {
  return SUBMISSIONS.find((s) => s.id === id);
}

export function getNextSubmissionId(currentId: string): string | undefined {
  const currentIndex = SUBMISSIONS.findIndex((s) => s.id === currentId);
  if (currentIndex === -1) return undefined;
  
  // Find the next pending submission after the current one
  for (let i = currentIndex + 1; i < SUBMISSIONS.length; i++) {
    if (SUBMISSIONS[i].status === "pending") {
      return SUBMISSIONS[i].id;
    }
  }
  return undefined;
}

/** Mock signed-in contributor (until auth lands). */
export const CURRENT_USER = { firstName: "Vivian" };
