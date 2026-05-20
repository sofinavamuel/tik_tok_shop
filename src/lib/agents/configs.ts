import type { AgentConfig } from './types';

export const agentConfigs: AgentConfig[] = [
  {
    phase: 'research',
    name: 'Research',
    icon: 'Search',
    description:
      'Data analysis from Kalodata and ScrapeCreators to identify market opportunities and trending products.',
    model: 'anthropic/claude-sonnet-4.5',
    systemPrompt: `You are a TikTok Shop market research analyst. Your role is to analyze market data from Kalodata and ScrapeCreators to identify trending products, emerging niches, and market opportunities. Focus on data-driven insights, quantifiable metrics, and actionable recommendations. Always respond with structured, organized data.`,
    tasks: [
      {
        title: 'Analyze Kalodata market trends',
        description:
          'Process Kalodata data to identify top-performing product categories, price ranges, and growth trends in the target market.',
        action: 'Analyze the provided Kalodata market data and return a structured report with: top 5 trending categories, average price points, growth rates, and market saturation levels.',
      },
      {
        title: 'Process ScrapeCreators data',
        description:
          'Analyze creator performance data to identify successful content patterns, posting schedules, and engagement metrics.',
        action: 'Analyze the provided creator data and return: top performing creator profiles, content patterns that drive engagement, optimal posting times, and audience demographics.',
      },
      {
        title: 'Synthesize research findings',
        description:
          'Combine Kalodata and ScrapeCreators insights into a unified market opportunity report.',
        action: 'Synthesize the market trends and creator data into a cohesive report highlighting: market gaps, opportunity areas, recommended product categories, and target audience profiles.',
      },
    ],
  },
  {
    phase: 'analysis',
    name: 'Analysis',
    icon: 'BarChart3',
    description:
      'Competitor and creator analysis to understand the competitive landscape and identify winning strategies.',
    model: 'anthropic/claude-sonnet-4.5',
    systemPrompt: `You are a competitive intelligence analyst specializing in TikTok Shop. Analyze competitors and creators to identify winning strategies, content patterns, and market positioning. Provide structured, actionable insights that can be replicated. Focus on what works and why.`,
    tasks: [
      {
        title: 'Competitor landscape analysis',
        description:
          'Identify and analyze direct and indirect competitors in the target niche, including their product offerings, pricing, and market positioning.',
        action: 'Analyze the competitor data and return: competitor profiles, their unique selling propositions, pricing strategies, market share estimates, and identified weaknesses.',
      },
      {
        title: 'Creator strategy analysis',
        description:
          'Analyze successful creators in the niche to understand their content strategy, engagement tactics, and monetization approaches.',
        action: 'Analyze top creators and return: content strategy breakdown, engagement tactics used, posting frequency, collaboration patterns, and revenue estimation.',
      },
      {
        title: 'Gap identification',
        description:
          'Identify gaps in the market where competitors are weak and opportunities exist for differentiation.',
        action: 'Based on competitor and creator analysis, identify: underserved audiences, content gaps, product opportunities, and differentiation strategies.',
      },
    ],
  },
  {
    phase: 'references',
    name: 'References',
    icon: 'Video',
    description:
      'Curate top 10 reference videos that serve as benchmarks for content quality and strategy.',
    model: 'anthropic/claude-sonnet-4.5',
    systemPrompt: `You are a TikTok content curator and trend analyst. Your role is to identify and analyze the top 10 reference videos that exemplify successful content in the target niche. For each video, provide detailed breakdown of what makes it successful and how its elements can be replicated.`,
    tasks: [
      {
        title: 'Identify top performing videos',
        description:
          'Select the top 10 videos based on engagement metrics, conversion rates, and relevance to the target product/niche.',
        action: 'From the provided video data, select top 10 videos ranked by: engagement rate, view-to-conversion ratio, content quality, and replicability. Include URL, metrics, and brief description for each.',
      },
      {
        title: 'Analyze video patterns',
        description:
          'Break down each reference video to identify common patterns in hooks, structure, editing style, and calls-to-action.',
        action: 'For each of the top 10 videos, analyze: hook type and timing, narrative structure, visual style, editing techniques, CTA placement, and emotional triggers used.',
      },
      {
        title: 'Extract replicable elements',
        description:
          'Identify specific elements from each video that can be directly replicated or adapted for new content.',
        action: 'Extract from each video: replicable hook formulas, script templates, visual patterns, editing techniques, and CTA strategies that can be applied to new videos.',
      },
    ],
  },
  {
    phase: 'briefing',
    name: 'Briefing',
    icon: 'FileText',
    description:
      'Generate a replicable video production template based on research and reference analysis.',
    model: 'anthropic/claude-sonnet-4.5',
    systemPrompt: `You are a TikTok Shop video production briefing expert. Create detailed, actionable video production briefs that can be followed by content creators. Each brief should include hook options, script structure, shot lists, and production notes. Make it replicable and specific.`,
    tasks: [
      {
        title: 'Define video concept',
        description:
          'Based on research and references, define the core video concept including target audience, key message, and value proposition.',
        action: 'Create a video concept document including: target audience profile, core message, unique value proposition, emotional angle, and desired viewer action.',
      },
      {
        title: 'Create script template',
        description:
          'Write a detailed script template with hook options, body structure, and CTA variations.',
        action: 'Generate a script template with: 3 hook variations (with timing), body structure with timestamps, 2 CTA options, and tone guidelines.',
      },
      {
        title: 'Generate shot list',
        description:
          'Create a detailed shot list with visual directions, B-roll suggestions, and editing notes.',
        action: 'Generate a shot list including: required shots with descriptions, B-roll suggestions, text overlay recommendations, music/style guidelines, and editing notes.',
      },
    ],
  },
  {
    phase: 'production',
    name: 'Production',
    icon: 'Clapperboard',
    description:
      'AI-assisted video production workflow including script generation, visual asset creation, and editing guidance.',
    model: 'openai/gpt-4o',
    systemPrompt: `You are a TikTok video production assistant. Help create video content by generating scripts, suggesting visual elements, and providing editing guidance. Focus on creating content that is engaging, authentic, and optimized for TikTok Shop conversions.`,
    tasks: [
      {
        title: 'Generate final script',
        description:
          'Using the briefing template, generate the final production-ready script with all variations resolved.',
        action: 'Generate a final script based on the briefing: select the best hook option, write the complete script with exact timing, include the most effective CTA, and add delivery notes.',
      },
      {
        title: 'Create visual asset plan',
        description:
          'Plan all visual assets needed including B-roll, text overlays, product shots, and graphics.',
        action: 'Create a visual asset plan listing: required product shots, B-roll footage needed, text overlay copy and timing, graphic elements, and music recommendations.',
      },
      {
        title: 'Generate editing instructions',
        description:
          'Create detailed editing instructions for post-production including transitions, effects, and pacing.',
        action: 'Generate editing instructions: transition types and timing, effects to apply, pacing guidelines, color grading notes, and audio mixing recommendations.',
      },
    ],
  },
  {
    phase: 'documentation',
    name: 'Documentation',
    icon: 'BookOpen',
    description:
      'Create comprehensive documentation including production manual and training materials.',
    model: 'openai/gpt-4o',
    systemPrompt: `You are a technical documentation specialist for TikTok Shop video production. Create clear, comprehensive documentation that enables anyone to replicate the video production process. Include step-by-step guides, checklists, and troubleshooting sections.`,
    tasks: [
      {
        title: 'Write production manual',
        description:
          'Create a step-by-step production manual covering the entire video creation process from concept to final export.',
        action: 'Write a production manual with: pre-production checklist, recording guidelines, editing workflow, quality control steps, and export settings.',
      },
      {
        title: 'Create training materials',
        description:
          'Develop training materials for content creators including best practices, common mistakes, and optimization tips.',
        action: 'Create training materials: best practices guide, common mistakes to avoid, optimization tips for different content types, and performance measurement guidelines.',
      },
      {
        title: 'Generate quality checklist',
        description:
          'Create a comprehensive quality assurance checklist for reviewing videos before publication.',
        action: 'Generate a QA checklist covering: content accuracy, video quality, audio quality, branding compliance, CTA effectiveness, and platform requirements.',
      },
    ],
  },
  {
    phase: 'delivery',
    name: 'Delivery',
    icon: 'Presentation',
    description:
      'Prepare client presentation materials including results summary, ROI projections, and next steps.',
    model: 'openai/gpt-4o',
    systemPrompt: `You are a client presentation specialist for TikTok Shop. Create compelling presentation materials that showcase results, demonstrate ROI, and provide clear next steps. Focus on data-driven storytelling and actionable recommendations.`,
    tasks: [
      {
        title: 'Compile results summary',
        description:
          'Aggregate all phase results into a comprehensive summary showing the complete workflow output.',
        action: 'Compile results from all previous phases into a summary: research findings, analysis insights, reference videos, briefing details, production output, and documentation.',
      },
      {
        title: 'Generate ROI projections',
        description:
          'Create ROI projections based on market data, competitor analysis, and reference video performance.',
        action: 'Generate ROI projections: estimated reach based on reference videos, projected engagement rates, conversion estimates, revenue projections, and timeline for results.',
      },
      {
        title: 'Create next steps plan',
        description:
          'Develop a clear action plan for implementing the video production strategy with timelines and milestones.',
        action: 'Create a next steps plan: implementation timeline, resource requirements, milestone definitions, risk mitigation strategies, and success metrics.',
      },
    ],
  },
];

export function getAgentConfig(phase: AgentConfig['phase']): AgentConfig {
  const config = agentConfigs.find((c) => c.phase === phase);
  if (!config) {
    throw new Error(`Unknown agent phase: ${phase}`);
  }
  return config;
}

export function getAllAgentConfigs(): AgentConfig[] {
  return agentConfigs;
}
