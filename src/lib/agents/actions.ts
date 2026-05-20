'use server';

import { insforge } from '@/lib/insforge';
import { getAgentConfig } from './configs';
import type { AgentPhase, AgentRun, AgentTask } from './types';

export interface RunPhaseInput {
  phase: AgentPhase;
  input?: Record<string, any>;
  mode?: 'sequential' | 'parallel';
}

export interface RunPhaseResult {
  run: AgentRun;
  error?: string;
}

/**
 * Execute all tasks for a given phase via InsForge AI.
 * Runs on the server to access the AI API.
 */
export async function runAgentPhase(
  input: RunPhaseInput,
): Promise<RunPhaseResult> {
  const { phase, input: phaseInput, mode = 'sequential' } = input;

  let config;
  try {
    config = getAgentConfig(phase);
  } catch (err) {
    return {
      run: {
        id: `run-${Date.now()}`,
        name: 'Failed Run',
        phase,
        tasks: [],
        status: 'failed',
        createdAt: new Date().toISOString(),
      },
      error: err instanceof Error ? err.message : 'Unknown phase',
    };
  }

  const runId = `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const tasks: AgentTask[] = config.tasks.map((t, i) => ({
    id: `task-${phase}-${i}`,
    phase,
    title: t.title,
    description: t.description,
    status: 'pending' as const,
  }));

  const run: AgentRun = {
    id: runId,
    name: `${config.name} Run`,
    phase,
    tasks,
    status: 'running',
    createdAt: new Date().toISOString(),
    metadata: phaseInput,
  };

  // Execute tasks
  if (mode === 'parallel') {
    await executeTasksParallel(run, config);
  } else {
    await executeTasksSequential(run, config);
  }

  const hasFailure = run.tasks.some((t) => t.status === 'failed');
  run.status = hasFailure ? 'failed' : 'completed';
  run.completedAt = new Date().toISOString();

  return { run };
}

async function executeTasksSequential(
  run: AgentRun,
  config: ReturnType<typeof getAgentConfig>,
): Promise<void> {
  for (let i = 0; i < run.tasks.length; i++) {
    const task = run.tasks[i];
    if (task.status === 'completed') continue;

    task.status = 'running';
    task.startedAt = new Date().toISOString();

    try {
      const result = await executeTask(task, run, config);
      task.result = result;
      task.status = 'completed';
    } catch (err) {
      task.error = err instanceof Error ? err.message : String(err);
      task.status = 'failed';
    }

    task.completedAt = new Date().toISOString();
  }
}

async function executeTasksParallel(
  run: AgentRun,
  config: ReturnType<typeof getAgentConfig>,
): Promise<void> {
  const results = await Promise.allSettled(
    run.tasks.map((task) => executeTask(task, run, config)),
  );

  results.forEach((result, i) => {
    const task = run.tasks[i];
    task.startedAt = task.startedAt ?? new Date().toISOString();
    if (result.status === 'fulfilled') {
      task.result = result.value;
      task.status = 'completed';
    } else {
      task.error =
        result.reason instanceof Error ? result.reason.message : String(result.reason);
      task.status = 'failed';
    }
    task.completedAt = new Date().toISOString();
  });
}

async function executeTask(
  task: AgentTask,
  run: AgentRun,
  config: ReturnType<typeof getAgentConfig>,
): Promise<any> {
  const taskConfig = config.tasks.find((t) => t.title === task.title);
  if (!taskConfig) {
    throw new Error(`Task config not found for: ${task.title}`);
  }

  // Build context from previous completed tasks
  const previousResults = run.tasks
    .filter((t) => t.status === 'completed' && t.result)
    .map((t) => ({
      task: t.title,
      result: t.result,
    }));

  const contextPrompt =
    previousResults.length > 0
      ? `\n\nContext from previous tasks in this run:\n${JSON.stringify(previousResults, null, 2)}`
      : '';

  const userInput = run.metadata
    ? `\n\nUser provided input:\n${JSON.stringify(run.metadata, null, 2)}`
    : '';

  const prompt = `${taskConfig.action}${contextPrompt}${userInput}`;

  const completion = await insforge.ai.chat.completions.create({
    model: config.model,
    messages: [
      { role: 'system', content: config.systemPrompt },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Empty AI response for task: ' + task.title);
  }

  // Try to parse as JSON, fallback to raw text
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Not JSON, return raw text
  }

  return content;
}

/**
 * Get the status of a specific agent run.
 * Note: Runs are stored client-side in localStorage.
 * This server action returns a placeholder since server cannot access localStorage.
 * Client should use the orchestrator's storage functions directly.
 */
export async function getAgentRun(_runId: string): Promise<AgentRun | null> {
  // Runs are stored client-side; client should read from localStorage directly
  return null;
}

/**
 * List all agent runs.
 * Note: Runs are stored client-side in localStorage.
 */
export async function listAgentRuns(): Promise<AgentRun[]> {
  // Runs are stored client-side; client should read from localStorage directly
  return [];
}
