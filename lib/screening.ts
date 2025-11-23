// lib/screening.ts

import { ScreeningTask } from "./types";

/**
 * Placeholder implementation for screening tasks.
 *
 * Previously this used mockScreeningTasks from mockData.
 * Now that you're moving to real data (e.g., Firebase),
 * this returns an empty list so the app still builds.
 *
 * Later you can replace this with a real implementation
 * that fetches tasks from your backend.
 */
export function getDueScreeningTasks(): ScreeningTask[] {
  // TODO: Replace with real data source (Firebase, API, etc.)
  return [];
}
