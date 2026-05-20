'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  BarChart3,
  Video,
  FileText,
  Clapperboard,
  BookOpen,
  Presentation,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllAgentConfigs } from '@/lib/agents/configs';
import { AgentOrchestrator, saveRunToStorage } from '@/lib/agents/orchestrator';
import type { AgentPhase, AgentRun } from '@/lib/agents/types';

const phaseIcons: Record<AgentPhase, typeof Search> = {
  research: Search,
  analysis: BarChart3,
  references: Video,
  briefing: FileText,
  production: Clapperboard,
  documentation: BookOpen,
  delivery: Presentation,
};

const phaseColors: Record<AgentPhase, string> = {
  research: 'bg-blue-50 border-blue-200 text-blue-700',
  analysis: 'bg-purple-50 border-purple-200 text-purple-700',
  references: 'bg-rose-50 border-rose-200 text-rose-700',
  briefing: 'bg-amber-50 border-amber-200 text-amber-700',
  production: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  documentation: 'bg-cyan-50 border-cyan-200 text-cyan-700',
  delivery: 'bg-violet-50 border-violet-200 text-violet-700',
};

const phaseIconColors: Record<AgentPhase, string> = {
  research: 'bg-blue-100 text-blue-600',
  analysis: 'bg-purple-100 text-purple-600',
  references: 'bg-rose-100 text-rose-600',
  briefing: 'bg-amber-100 text-amber-600',
  production: 'bg-emerald-100 text-emerald-600',
  documentation: 'bg-cyan-100 text-cyan-600',
  delivery: 'bg-violet-100 text-violet-600',
};

function getStatusIcon(status: AgentRun['status']) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'running':
      return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
}

function getStatusLabel(status: AgentRun['status']) {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    case 'running':
      return 'Running';
    default:
      return 'Pending';
  }
}

export default function AgentsDashboardPage() {
  const configs = getAllAgentConfigs();
  const [activeRuns, setActiveRuns] = useState<AgentRun[]>([]);
  const [runningPhases, setRunningPhases] = useState<Set<AgentPhase>>(new Set());
  const [selectedPhase, setSelectedPhase] = useState<AgentPhase | null>(null);

  const getPhaseRuns = useCallback(
    (phase: AgentPhase) => {
      return activeRuns.filter((r) => r.phase === phase);
    },
    [activeRuns],
  );

  const handleRunPhase = async (phase: AgentPhase) => {
    setRunningPhases((prev) => new Set(prev).add(phase));

    const orchestrator = new AgentOrchestrator(phase);

    const updateHandler = (run: AgentRun) => {
      setActiveRuns((prev) => {
        const filtered = prev.filter((r) => r.id !== run.id);
        return [...filtered, run];
      });
    };

    try {
      const result = await orchestrator.executeSequential(updateHandler);
      saveRunToStorage(result);
    } catch (err) {
      console.error(`Failed to run phase ${phase}:`, err);
    } finally {
      setRunningPhases((prev) => {
        const next = new Set(prev);
        next.delete(phase);
        return next;
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Orchestration</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage the 7-phase AI agent workflow for TikTok Shop video production.
          </p>
        </div>
      </div>

      {/* Phase Overview Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {configs.map((config) => {
          const Icon = phaseIcons[config.phase];
          const runs = getPhaseRuns(config.phase);
          const latestRun = runs[runs.length - 1];
          const isRunning = runningPhases.has(config.phase);

          return (
            <div
              key={config.phase}
              className={cn(
                'rounded-xl border p-5 transition-shadow hover:shadow-md',
                phaseColors[config.phase],
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'rounded-lg p-2',
                      phaseIconColors[config.phase],
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{config.name}</h3>
                    <p className="text-xs opacity-75">{config.model}</p>
                  </div>
                </div>
                {latestRun && getStatusIcon(latestRun.status)}
              </div>

              <p className="mt-3 text-xs opacity-75">{config.description}</p>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={`/admin/agents/${config.phase}`}
                  className="flex items-center gap-1 text-xs font-medium hover:underline"
                >
                  View details <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleRunPhase(config.phase)}
                  disabled={isRunning}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                    isRunning
                      ? 'cursor-not-allowed bg-white/50 opacity-60'
                      : 'bg-white/80 hover:bg-white',
                  )}
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" />
                      Run Phase
                    </>
                  )}
                </button>
              </div>

              {latestRun && (
                <div className="mt-2 text-xs opacity-75">
                  {latestRun.tasks.filter((t) => t.status === 'completed').length}/
                  {latestRun.tasks.length} tasks complete
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Runs */}
      {activeRuns.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Recent Runs</h2>
          <div className="mt-4 space-y-3">
            {activeRuns
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
              )
              .map((run) => {
                const Icon = phaseIcons[run.phase];
                return (
                  <div
                    key={run.id}
                    className="rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gray-100 p-2">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{run.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(run.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(run.status)}
                        <span className="text-sm text-gray-600">
                          {getStatusLabel(run.status)}
                        </span>
                      </div>
                    </div>

                    {/* Task progress */}
                    <div className="mt-3">
                      <div className="flex gap-1">
                        {run.tasks.map((task) => (
                          <div
                            key={task.id}
                            className={cn(
                              'h-1.5 flex-1 rounded-full',
                              task.status === 'completed'
                                ? 'bg-emerald-500'
                                : task.status === 'failed'
                                  ? 'bg-red-500'
                                  : task.status === 'running'
                                    ? 'bg-blue-500 animate-pulse'
                                    : 'bg-gray-200',
                            )}
                            title={`${task.title}: ${task.status}`}
                          />
                        ))}
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-gray-500">
                        <span>
                          {run.tasks.filter((t) => t.status === 'completed').length}/
                          {run.tasks.length} tasks
                        </span>
                        <Link
                          href={`/admin/agents/${run.phase}`}
                          className="text-blue-600 hover:underline"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Workflow Overview */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Workflow Pipeline</h2>
        <p className="mt-1 text-sm text-gray-500">
          The 7-phase methodology flows sequentially from research to delivery.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {configs.map((config, i) => {
            const Icon = phaseIcons[config.phase];
            return (
              <div key={config.phase} className="flex items-center gap-2">
                <Link
                  href={`/admin/agents/${config.phase}`}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50',
                    phaseColors[config.phase],
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{config.name}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </Link>
                {i < configs.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
