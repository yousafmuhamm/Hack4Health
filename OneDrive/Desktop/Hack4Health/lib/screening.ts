// lib/screening.ts

import { ScreeningTask } from './types';
import { mockScreeningTasks } from './mockData';

export function getDueScreeningTasks(): ScreeningTask[] {
  // In a real system we would calculate this from lastDone + rules.
  // For MVP we just return tasks with status 'due'.
  return mockScreeningTasks.filter((task) => task.status === 'due');
}
