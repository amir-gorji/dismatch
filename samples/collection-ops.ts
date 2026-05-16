/**
 * Collection Operations
 *
 * Demonstrates the complete collection family: find, some, every, groupBy, filterMap.
 * All ops are single-pass, allocation-conscious, and variant-aware.
 */

import { find, some, every, groupBy, filterMap } from 'dismatch';

// ── Types ──────────────────────────────────────────────────────────────────────

type Task =
  | { type: 'todo'; title: string; priority: 'low' | 'high' }
  | { type: 'in_progress'; title: string; assignee: string }
  | { type: 'done'; title: string; completedAt: Date }
  | { type: 'blocked'; title: string; reason: string };

// ── Sample data ────────────────────────────────────────────────────────────────

const tasks: Task[] = [
  { type: 'todo', title: 'Write tests', priority: 'high' },
  { type: 'in_progress', title: 'Fix bug', assignee: 'alice' },
  { type: 'todo', title: 'Update docs', priority: 'low' },
  { type: 'done', title: 'Design review', completedAt: new Date('2026-05-01') },
  { type: 'blocked', title: 'Deploy', reason: 'Waiting for approval' },
  { type: 'in_progress', title: 'Code review', assignee: 'bob' },
  { type: 'done', title: 'Planning', completedAt: new Date('2026-04-28') },
];

// ── find ───────────────────────────────────────────────────────────────────────

// First blocked task, or undefined if none
const firstBlocked = find(tasks, 'blocked');
// ^ { type: 'blocked'; title: string; reason: string } | undefined

// First actionable task (todo or in_progress)
const firstActionable = find(tasks, ['todo', 'in_progress'] as const);
// ^ { type: 'todo'; ... } | { type: 'in_progress'; ... } | undefined

// ── some / every ───────────────────────────────────────────────────────────────

// Is there work still in flight?
const hasActiveWork = some(tasks, ['todo', 'in_progress'] as const); // true

// Are all tasks resolved (done or blocked)?
const allResolved = every(tasks, ['done', 'blocked'] as const); // false

// Is there anything blocked right now?
const hasBlocker = some(tasks, 'blocked'); // true

// ── groupBy ────────────────────────────────────────────────────────────────────

// All tasks grouped by status in one pass — each group is narrowed to its variant
const groups = groupBy(tasks);

const todoTasks = groups.todo;         // { type: 'todo'; title: string; priority: ... }[]
const doneTasks = groups.done;         // { type: 'done'; title: string; completedAt: Date }[]
const inProgress = groups.in_progress; // { type: 'in_progress'; title: string; assignee: string }[]

// ── filterMap ──────────────────────────────────────────────────────────────────

// Extract titles of high-priority todos only (filter + transform in one pass)
const urgentTitles: string[] = filterMap(tasks, {
  todo: ({ title, priority }) => priority === 'high' ? title : undefined,
  // in_progress, done, blocked omitted — silently skipped
});

// Build a summary of active work with assignee info
const activeSummaries: string[] = filterMap(tasks, {
  todo: ({ title, priority }) => `[${priority.toUpperCase()}] ${title}`,
  in_progress: ({ title, assignee }) => `${title} (${assignee})`,
});

// Collect completion timestamps — null is a valid result; undefined signals skip
const completionDates: Date[] = filterMap(tasks, {
  done: ({ completedAt }) => completedAt,
});

// Verify results
firstBlocked;
firstActionable;
hasActiveWork;
allResolved;
hasBlocker;
todoTasks;
doneTasks;
inProgress;
urgentTitles;
activeSummaries;
completionDates;
