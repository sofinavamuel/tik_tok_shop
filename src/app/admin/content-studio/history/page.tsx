'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  getSavedContentIdeasAction,
  deleteContentIdeaAction,
} from '@/lib/ai/actions';
import {
  Loader2,
  Search,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Lightbulb,
  Clock,
  Target,
  Music,
  Eye,
  Play,
  Copy,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface SavedIdea {
  id: string;
  title: string;
  angle: string;
  hook_options: string[];
  recommended_hook: string;
  hook_type: string;
  script: { opening: string; body: string; closing: string };
  structure: string;
  visual_style: string[];
  audio_direction: string;
  duration: string;
  cta: string;
  why_it_works: string;
  adapted_from: string;
  confidence_score: number;
  product_name: string;
  product_category: string;
  brand_name: string | null;
  target_market: string | null;
  content_goal: string | null;
  market_insights: string[];
  winning_patterns: string[];
  product_summary: string;
  recommended_approach: string;
  created_at: string;
}

function ConfidenceBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'bg-emerald-100 text-emerald-700'
      : score >= 60
        ? 'bg-amber-100 text-amber-700'
        : 'bg-red-100 text-red-700';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {score}% confidence
    </span>
  );
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function IdeaDetailCard({ idea, onDelete }: { idea: SavedIdea; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fullScript = `${idea.script.opening}\n\n${idea.script.body}\n\n${idea.script.closing}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this idea?')) return;
    setDeleting(true);
    try {
      await deleteContentIdeaAction(idea.id);
      onDelete(idea.id);
    } catch {
      alert('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-white font-bold text-sm">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{idea.title}</h3>
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{idea.angle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <ConfidenceBadge score={idea.confidence_score} />
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              title="Delete"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Context badges */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
            {idea.product_name}
          </span>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {idea.product_category}
          </span>
          {idea.brand_name && (
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
              {idea.brand_name}
            </span>
          )}
          {idea.content_goal && (
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-600">
              {idea.content_goal}
            </span>
          )}
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 gap-3 border-b border-gray-100 bg-gray-50/50 px-5 py-3 text-sm sm:grid-cols-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>{idea.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Target className="h-4 w-4 text-gray-400" />
          <span className="truncate">{idea.hook_type}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Music className="h-4 w-4 text-gray-400" />
          <span className="truncate">{idea.audio_direction.split(' ').slice(0, 3).join(' ')}...</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Eye className="h-4 w-4 text-gray-400" />
          <span className="truncate">{idea.visual_style[0]}</span>
        </div>
      </div>

      {/* Recommended Hook */}
      <div className="px-5 py-4">
        <div className="rounded-lg bg-brand/10 border border-brand/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-brand" />
            <span className="text-sm font-semibold text-brand-dark">Recommended Hook</span>
          </div>
          <p className="text-base font-medium text-brand-darker">&ldquo;{idea.recommended_hook}&rdquo;</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {idea.hook_options
              .filter((h: string) => h !== idea.recommended_hook)
              .map((h: string, i: number) => (
                <span key={i} className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">
                  Alt: &ldquo;{h}&rdquo;
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      <div className="px-5 pb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Hide details
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show script, visuals & structure
            </>
          )}
        </button>

        {expanded && (
          <div className="mt-4 space-y-4">
            {/* Script */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Script
                </h4>
                <button
                  onClick={() => copyToClipboard(fullScript)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-brand">Opening (0-3s):</span>
                  <p className="mt-1 text-gray-700">{idea.script.opening}</p>
                </div>
                <div>
                  <span className="font-medium text-brand">Body:</span>
                  <p className="mt-1 text-gray-700">{idea.script.body}</p>
                </div>
                <div>
                  <span className="font-medium text-brand">Closing:</span>
                  <p className="mt-1 text-gray-700">{idea.script.closing}</p>
                </div>
              </div>
            </div>

            {/* Structure */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Structure</h4>
              <p className="text-sm text-gray-700">{idea.structure}</p>
            </div>

            {/* Visual Style */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Visual Direction</h4>
              <div className="flex flex-wrap gap-2">
                {idea.visual_style.map((v: string, i: number) => (
                  <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Why It Works */}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h4 className="text-sm font-semibold text-emerald-800 mb-1">Why It Works</h4>
              <p className="text-sm text-emerald-700">{idea.why_it_works}</p>
            </div>

            {/* CTA */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Call to Action</h4>
              <p className="text-sm text-gray-700 font-medium">{idea.cta}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IdeasLibraryPage() {
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchProduct, setSearchProduct] = useState('');
  const [searchBrand, setSearchBrand] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getSavedContentIdeasAction({
        limit: 100,
        product: searchProduct || undefined,
        brand: searchBrand || undefined,
      });
      setIdeas(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ideas');
    } finally {
      setLoading(false);
    }
  }, [searchProduct, searchBrand]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handleDelete = (id: string) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
    setTotal((prev) => prev - 1);
  };

  // Group ideas by product + date
  const grouped = ideas.reduce<Record<string, SavedIdea[]>>((acc, idea) => {
    const key = `${idea.product_name} — ${formatRelativeDate(idea.created_at)}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(idea);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/content-studio"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ideas Library</h1>
              <p className="mt-1 text-sm text-gray-500">
                {total} saved content idea{total !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        <Link
          href="/admin/content-studio"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Generate New
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              placeholder="Search by product..."
              className="w-full text-sm border-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
              placeholder="Search by brand..."
              className="w-full text-sm border-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-20 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Loading ideas...</h3>
        </div>
      ) : ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-20 text-center">
          <Sparkles className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No saved ideas yet</h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Generate content ideas in Content Studio and save them to build your library.
          </p>
          <Link
            href="/admin/content-studio"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Go to Content Studio
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([groupKey, groupIdeas]) => (
            <div key={groupKey}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {groupKey}
              </h2>
              <div className="space-y-4">
                {groupIdeas.map((idea) => (
                  <IdeaDetailCard key={idea.id} idea={idea} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
