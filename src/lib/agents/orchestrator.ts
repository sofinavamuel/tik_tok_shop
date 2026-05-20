import { insforge } from '@/lib/insforge';
import type { AgentPhase, AgentRun, AgentTask, AgentConfig } from './types';
import { getAgentConfig } from './configs';

const STORAGE_KEY = 'tiktok-shop-agent-runs';

// ── localStorage persistence ──

function getStoredRuns(): AgentRun[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRuns(runs: AgentRun[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
}

export function getRunFromStorage(runId: string): AgentRun | undefined {
  return getStoredRuns().find((r) => r.id === runId);
}

export function getAllRunsFromStorage(): AgentRun[] {
  return getStoredRuns();
}

export function saveRunToStorage(run: AgentRun): void {
  const runs = getStoredRuns();
  const idx = runs.findIndex((r) => r.id === run.id);
  if (idx >= 0) {
    runs[idx] = run;
  } else {
    runs.push(run);
  }
  saveRuns(runs);
}

// ── Orchestrator ──

export class AgentOrchestrator {
  private config: AgentConfig;
  private run: AgentRun;

  constructor(phase: AgentPhase, input?: Record<string, any>) {
    this.config = getAgentConfig(phase);
    this.run = {
      id: `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: `${this.config.name} Run`,
      phase: this.config.phase,
      tasks: this.config.tasks.map((t, i) => ({
        id: `task-${this.config.phase}-${i}`,
        phase: this.config.phase,
        title: t.title,
        description: t.description,
        status: 'pending' as const,
      })),
      status: 'pending',
      createdAt: new Date().toISOString(),
      metadata: input,
    };
  }

  getRun(): AgentRun {
    return this.run;
  }

  /** Execute all tasks sequentially */
  async executeSequential(
    onUpdate?: (run: AgentRun) => void,
  ): Promise<AgentRun> {
    this.run.status = 'running';
    this.saveAndNotify(onUpdate);

    for (let i = 0; i < this.run.tasks.length; i++) {
      const task = this.run.tasks[i];
      if (task.status === 'completed') continue;

      task.status = 'running';
      task.startedAt = new Date().toISOString();
      this.saveAndNotify(onUpdate);

      try {
        const result = await this.executeTask(task);
        task.result = result;
        task.status = 'completed';
        task.completedAt = new Date().toISOString();
      } catch (err) {
        task.error = err instanceof Error ? err.message : String(err);
        task.status = 'failed';
        task.completedAt = new Date().toISOString();
        this.run.status = 'failed';
        this.run.completedAt = new Date().toISOString();
        this.saveAndNotify(onUpdate);
        return this.run;
      }

      this.saveAndNotify(onUpdate);
    }

    this.run.status = 'completed';
    this.run.completedAt = new Date().toISOString();
    this.saveAndNotify(onUpdate);
    return this.run;
  }

  /** Execute all tasks in parallel */
  async executeParallel(
    onUpdate?: (run: AgentRun) => void,
  ): Promise<AgentRun> {
    this.run.status = 'running';
    this.saveAndNotify(onUpdate);

    const pendingTasks = this.run.tasks.filter((t) => t.status !== 'completed');

    for (const task of pendingTasks) {
      task.status = 'running';
      task.startedAt = new Date().toISOString();
    }
    this.saveAndNotify(onUpdate);

    const results = await Promise.allSettled(
      pendingTasks.map((task) => this.executeTask(task)),
    );

    results.forEach((result, i) => {
      const task = pendingTasks[i];
      if (result.status === 'fulfilled') {
        task.result = result.value;
        task.status = 'completed';
      } else {
        task.error = result.reason instanceof Error ? result.reason.message : String(result.reason);
        task.status = 'failed';
      }
      task.completedAt = new Date().toISOString();
    });

    const hasFailure = pendingTasks.some((t) => t.status === 'failed');
    this.run.status = hasFailure ? 'failed' : 'completed';
    this.run.completedAt = new Date().toISOString();
    this.saveAndNotify(onUpdate);
    return this.run;
  }

  /** Execute a single task via InsForge AI */
  private async executeTask(task: AgentTask): Promise<any> {
    const taskConfig = this.config.tasks.find((t) => t.title === task.title);
    if (!taskConfig) {
      throw new Error(`Task config not found for: ${task.title}`);
    }

    // Build context from previous completed tasks
    const previousResults = this.run.tasks
      .filter((t) => t.status === 'completed' && t.result)
      .map((t) => ({
        task: t.title,
        result: t.result,
      }));

    const contextPrompt =
      previousResults.length > 0
        ? `\n\nContext from previous tasks in this run:\n${JSON.stringify(previousResults, null, 2)}`
        : '';

    const userInput = this.run.metadata
      ? `\n\nUser provided input:\n${JSON.stringify(this.run.metadata, null, 2)}`
      : '';

    const prompt = `${taskConfig.action}${contextPrompt}${userInput}`;

    const completion = await insforge.ai.chat.completions.create({
      model: this.config.model,
      messages: [
        { role: 'system', content: this.config.systemPrompt },
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

  private saveAndNotify(onUpdate?: (run: AgentRun) => void): void {
    saveRunToStorage({ ...this.run });
    onUpdate?.({ ...this.run });
  }
}

/** Create a new agent run for a phase */
export function createAgentRun(
  phase: AgentPhase,
  input?: Record<string, any>,
): AgentRun {
  const config = getAgentConfig(phase);
  return {
    id: `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: `${config.name} Run`,
    phase,
    tasks: config.tasks.map((t, i) => ({
      id: `task-${phase}-${i}`,
      phase,
      title: t.title,
      description: t.description,
      status: 'pending' as const,
    })),
    status: 'pending',
    createdAt: new Date().toISOString(),
    metadata: input,
  };
}
