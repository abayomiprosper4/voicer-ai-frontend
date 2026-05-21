/**
 * In-memory mock tasks so the contributor flow is clickable before the API
 * exists (PRD §8.2 Task Management). Swap for a real fetch later — keep the
 * `Task` shape stable.
 */

export type TaskType = "read" | "spontaneous";
export type TaskLanguage = "English" | "Yoruba" | "Pidgin";

export type Task = {
  id: string;
  type: TaskType;
  language: TaskLanguage;
  /** Read: the sentence to read aloud. Spontaneous: the prompt to speak about. */
  prompt: string;
  /** Spontaneous only: an example answer shown in the surface panel. */
  dateSubmitted: string;
  sample?: string;
  /** Spontaneous only: target/max recording length in seconds. */
  maxDurationSecs?: number;
};

const TASKS: Task[] = [
  {
    id: "t1",
    type: "read",
    language: "Yoruba",
    prompt: "Mo n lọ sí ilé",
    dateSubmitted: "2024-03-10",
  },
  {
    id: "t2",
    type: "spontaneous",
    language: "Pidgin",
    prompt: "Yarn us the food wey you like",
    dateSubmitted: "2024-03-11",
    maxDurationSecs: 20,
  },
  {
    id: "t3",
    type: "read",
    language: "English",
    prompt: "I am going to the market",
    dateSubmitted: "2024-03-12",
  },
  {
    id: "t4",
    type: "read",
    language: "Yoruba",
    prompt: "A ni lati ka iwe fun idanwo to n bo",
    dateSubmitted: "2024-03-13",
    maxDurationSecs: 30,
  },
  {
    id: "t5",
    type: "read",
    language: "English",
    prompt: "I am going to Nithub today to make use of the Wi-Fi for this project. I really need to get there as early as possible.",
    dateSubmitted: "2024-03-14",
  },
  {
    id: "t6",
    type: "spontaneous",
    language: "English",
    prompt: "Describe your morning routine",
    sample:
      "When I wake up in the morning, I brush my teeth and make ablution to pray. After praying, I take my bath and make breakfast for the family before leaving for work.",
    dateSubmitted: "2024-03-16",
    maxDurationSecs: 600,
  },
];

export function getTasks(type?: TaskType): Task[] {
  return type ? TASKS.filter((t) => t.type === type) : TASKS;
}

export function getTaskById(id: string): Task | undefined {
  return TASKS.find((t) => t.id === id);
}

/** Next task after the given id (used by the recorder's → arrow). */
export function getNextTaskId(id: string): string | undefined {
  const i = TASKS.findIndex((t) => t.id === id);
  if (i === -1 || i === TASKS.length - 1) return undefined;
  return TASKS[i + 1].id;
}
