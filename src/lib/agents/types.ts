export type AgentPhase =
  | 'research'
  | 'analysis'
  | 'references'
  | 'briefing'
  | 'production'
  | 'documentation'
  | 'delivery';

export interface AgentTask {
  id: string;
  phase: AgentPhase;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface AgentRun {
  id: string;
  name: string;
  phase: AgentPhase;
  tasks: AgentTask[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, any>;
}

export interface AgentConfig {
  phase: AgentPhase;
  name: string;
  icon: string;
  description: string;
  model: string; // AI model to use
  systemPrompt: string;
  tasks: { title: string; description: string; action: string }[];
}
