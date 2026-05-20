'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  ArrowLeft,
  ChevronRight,
  Copy,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAgentConfig } from '@/lib/agents/configs';
import { AgentOrchestrator, saveRunToStorage, getRunFromStorage, getAllRunsFromStorage } from '@/lib/agents/orchestrator';
import type { AgentPhase, AgentRun, AgentTask } from '@/lib/agents/types';

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

function getStatusIcon(status: AgentTask['status']) {
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

function getStatusLabel(status: AgentTask['status']) {
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

export default function AgentPhaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const phase = params.phase as AgentPhase;

  const config = getAgentConfig(phase);
  const Icon = phaseIcons[phase];

  const [isRunning, setIsRunning] = useState(false);
  const [currentRun, setCurrentRun] = useState<AgentRun | null>(null);
  const [pastRuns, setPastRuns] = useState<AgentRun[]>([]);
  const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);
  const [inputData, setInputData] = useState('');

  // Load past runs on mount
  useEffect(() => {
    const allRuns = getAllRunsFromStorage();
    const phaseRuns = allRuns.filter((r) => r.phase === phase);
    setPastRuns(phaseRuns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, [phase]);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setSelectedTask(null);

    let parsedInput: Record<string, any> | undefined;
    if (inputData.trim()) {
      try {
        parsedInput = JSON.parse(inputData);
      } catch {
        parsedInput = { raw: inputData };
      }
    }

    const orchestrator = new AgentOrchestrator(phase, parsedInput);

    const updateHandler = (run: AgentRun) => {
      setCurrentRun({ ...run });
    };

    try {
      const result = await orchestrator.executeSequential(updateHandler);
      saveRunToStorage(result);
      setCurrentRun(result);

      // Refresh past runs
      const allRuns = getAllRunsFromStorage();
      const phaseRuns = allRuns.filter((r) => r.phase === phase);
      setPastRuns(phaseRuns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error(`Failed to run phase ${phase}:`, err);
    } finally {
      setIsRunning(false);
    }
  }, [phase, inputData]);

  const handleCopyResult = (result: any) => {
    const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
  };

  const handleExportResults = () => {
    if (!currentRun) return;
    const data = {
      phase: currentRun.phase,
      runId: currentRun.id,
      createdAt: currentRun.createdAt,
      tasks: currentRun.tasks.map((t) => ({
        title: t.title,
        status: t.status,
        result: t.result,
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-run-${currentRun.phase}-${currentRun.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/agents"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className={cn('rounded-lg p-2', phaseIconColors[phase])}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{config.name}</h1>
            <p className="text-sm text-gray-500">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Model info */}
      <div className={cn('mt-4 rounded-lg border p-3 text-sm', phaseColors[phase])}>
        <span className="font-medium">AI Model:</span> {config.model}
      </div>

      {/* Input Section */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Phase Input</h2>
        <p className="mt-1 text-sm text-gray-500">
          Provide context or data for this phase (optional). JSON or plain text.
        </p>
        <textarea
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder='{"market": "US", "niche": "beauty", "product": "lip gloss"}'
          className="mt-3 w-full rounded-lg border border-gray-300 p-3 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows={4}
        />
        <button
          onClick={handleRun}
          disabled={isRunning}
          className={cn(
            'mt-3 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors',
            isRunning
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-gray-900 hover:bg-gray-800',
          )}
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run All Tasks
            </>
          )}
        </button>
      </div>

      {/* Tasks */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
        <div className="mt-4 space-y-3">
          {(currentRun?.tasks ?? config.tasks.map((t, i) => ({
            id: `task-${phase}-${i}`,
            phase,
            title: t.title,
            description: t.description,
            status: 'pending' as const,
          }))).map((task, i) => (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={cn(
                'w-full rounded-lg border p-4 text-left transition-colors hover:bg-gray-50',
                selectedTask?.id === task.id
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200',
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.description}</p>
                </div>
                {getStatusIcon(task.status)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Task Result */}
      {selectedTask && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedTask.title}
            </h2>
            <div className="flex items-center gap-2">
              {selectedTask.result && (
                <>
                  <button
                    onClick={() => handleCopyResult(selectedTask.result)}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                  <button
                    onClick={handleExportResults}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <Download className="h-3 w-3" />
                    Export
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-1 flex items-center gap-2">
            {getStatusIcon(selectedTask.status)}
            <span className="text-sm text-gray-500">
              {getStatusLabel(selectedTask.status)}
            </span>
            {selectedTask.startedAt && (
              <span className="text-xs text-gray-400">
                Started: {new Date(selectedTask.startedAt).toLocaleTimeString()}
              </span>
            )}
          </div>

          {selectedTask.error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <p className="font-medium">Error:</p>
              <p>{selectedTask.error}</p>
            </div>
          )}

          {selectedTask.result && (
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {typeof selectedTask.result === 'string'
                  ? selectedTask.result
                  : JSON.stringify(selectedTask.result, null, 2)}
              </pre>
            </div>
          )}

          {!selectedTask.result && !selectedTask.error && (
            <div className="mt-4 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
              Run the phase to see results for this task.
            </div>
          )}
        </div>
      )}

      {/* Past Runs */}
      {pastRuns.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Past Runs</h2>
          <div className="mt-4 space-y-2">
            {pastRuns.map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(run.status)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{run.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(run.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {run.tasks.filter((t) => t.status === 'completed').length}/
                    {run.tasks.length}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
