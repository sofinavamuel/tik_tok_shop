'use client';

import { useState, useMemo } from 'react';
import {
  MOCK_PRODUCTS,
  MOCK_VIDEO_INSIGHTS,
} from '@/lib/kalodata/client';
import { generateContentIdeasAction } from '@/lib/ai/actions';
import type { KalodataProduct, KalodataVideoInsight } from '@/lib/kalodata/types';
import type { ContentIdeasResult, ContentIdea } from '@/lib/ai/generate-content-ideas';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  Target,
  Copy,
  Save,
  ChevronDown,
  ChevronUp,
  Play,
  Music,
  Clock,
  Eye,
} from 'lucide-react';

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
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

function IdeaCard({ idea, index }: { idea: ContentIdea; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fullScript = `${idea.script.opening}\n\n${idea.script.body}\n\n${idea.script.closing}`;

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm">
              {index + 1}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{idea.angle}</p>
            </div>
          </div>
          <ConfidenceBadge score={idea.confidenceScore} />
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
          <span className="truncate">{idea.hookType}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Music className="h-4 w-4 text-gray-400" />
          <span className="truncate">{idea.audioDirection.split(' ').slice(0, 3).join(' ')}...</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Eye className="h-4 w-4 text-gray-400" />
          <span className="truncate">{idea.visualStyle[0]}</span>
        </div>
      </div>

      {/* Recommended Hook */}
      <div className="px-5 py-4">
        <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">Recommended Hook</span>
          </div>
          <p className="text-base font-medium text-indigo-900">&ldquo;{idea.recommendedHook}&rdquo;</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {idea.hookOptions
              .filter((h) => h !== idea.recommendedHook)
              .map((h, i) => (
                <span key={i} className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-600">
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
                  <span className="font-medium text-indigo-600">Opening (0-3s):</span>
                  <p className="mt-1 text-gray-700">{idea.script.opening}</p>
                </div>
                <div>
                  <span className="font-medium text-indigo-600">Body:</span>
                  <p className="mt-1 text-gray-700">{idea.script.body}</p>
                </div>
                <div>
                  <span className="font-medium text-indigo-600">Closing:</span>
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
                {idea.visualStyle.map((v, i) => (
                  <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Why It Works */}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h4 className="text-sm font-semibold text-emerald-800 mb-1">Why It Works</h4>
              <p className="text-sm text-emerald-700">{idea.whyItWorks}</p>
            </div>

            {/* Adapted From */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Adapted From</h4>
              <p className="text-sm text-gray-600">{idea.adaptedFrom}</p>
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

export default function ContentStudioPage() {
  const [selectedProduct, setSelectedProduct] = useState<KalodataProduct | null>(null);
  const [brandName, setBrandName] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [contentGoal, setContentGoal] = useState<'awareness' | 'engagement' | 'conversion' | 'education'>('engagement');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<ContentIdeasResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Filter video insights for selected product
  const productInsights = useMemo(() => {
    if (!selectedProduct) return [];
    return MOCK_VIDEO_INSIGHTS.filter((v) => v.product === selectedProduct.name);
  }, [selectedProduct]);

  const handleGenerate = async () => {
    if (!selectedProduct) return;
    setGenerating(true);
    setError(null);
    setResult(null);
    setSaved(false);

    try {
      const ideasResult = await generateContentIdeasAction({
        product: selectedProduct,
        videoInsights: productInsights,
        brandName: brandName || undefined,
        brandDescription: brandDescription || undefined,
        targetMarket: targetMarket || undefined,
        contentGoal,
      });
      setResult(ideasResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Studio</h1>
        <p className="mt-1 text-sm text-gray-500">
          Use TikTok Shop market data to generate viral content ideas for any brand or client.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Panel: Configuration */}
        <div className="lg:col-span-1 space-y-6">
          {/* Product Selection */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              1. Select Trending Product
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {MOCK_PRODUCTS.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setResult(null);
                    setSaved(false);
                  }}
                  className={`w-full text-left rounded-lg border p-3 transition-all ${
                    selectedProduct?.id === product.id
                      ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 truncate">{product.name}</span>
                    <span
                      className={`text-xs font-medium ${
                        product.trend === 'rising'
                          ? 'text-emerald-600'
                          : product.trend === 'declining'
                            ? 'text-red-600'
                            : 'text-amber-600'
                      }`}
                    >
                      {product.growth_rate > 0 ? '+' : ''}{product.growth_rate}%
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <span>{product.category}</span>
                    <span>GMV: {formatCurrency(product.gmv_30d)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Video Insights Preview */}
          {selectedProduct && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Winning Video Patterns ({productInsights.length})
              </h2>
              {productInsights.length > 0 ? (
                <div className="space-y-3">
                  {productInsights.map((insight, i) => (
                    <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">{insight.creator}</span>
                        <span className="text-gray-500">{formatNumber(insight.views)} views</span>
                      </div>
                      <p className="text-xs text-gray-600 italic">&ldquo;{insight.hook_text}&rdquo;</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                          {insight.hook_type}
                        </span>
                        <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700">
                          {insight.retention_rate}% retention
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No specific video insights for this product in mock data.</p>
              )}
            </div>
          )}

          {/* Brand Context (Optional) */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              2. Brand Context <span className="text-gray-400 font-normal">(optional)</span>
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g., Espacio EME"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Brand Description</label>
                <textarea
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  placeholder="What does the brand do?"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Target Market</label>
                <input
                  type="text"
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  placeholder="e.g., Spain, Latin America"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Content Goal</label>
                <select
                  value={contentGoal}
                  onChange={(e) => setContentGoal(e.target.value as typeof contentGoal)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="awareness">Awareness</option>
                  <option value="engagement">Engagement</option>
                  <option value="conversion">Conversion</option>
                  <option value="education">Education</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedProduct || generating}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {generating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating ideas...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Content Ideas
              </>
            )}
          </button>
        </div>

        {/* Right Panel: Results */}
        <div className="lg:col-span-2">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {!result && !generating && (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-20 text-center">
              <Sparkles className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Select a product and generate ideas</h3>
              <p className="mt-2 max-w-sm text-sm text-gray-500">
                Choose a trending product from TikTok Shop data, optionally add brand context, and let AI generate 5 content ideas with hooks, scripts, and visual direction.
              </p>
            </div>
          )}

          {generating && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-20 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Analyzing market data...</h3>
              <p className="mt-2 text-sm text-gray-500">
                AI is analyzing winning patterns and generating content ideas.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Market Analysis</h2>
                <p className="text-sm text-gray-700 mb-4">{result.productSummary}</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Market Insights
                    </h3>
                    <ul className="space-y-1">
                      {result.marketInsights.map((insight, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Winning Patterns
                    </h3>
                    <ul className="space-y-1">
                      {result.winningPatterns.map((pattern, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                          {pattern}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {result.recommendedApproach && (
                  <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4">
                    <h3 className="text-sm font-semibold text-amber-800 mb-1">Recommended Approach</h3>
                    <p className="text-sm text-amber-700">{result.recommendedApproach}</p>
                  </div>
                )}
              </div>

              {/* Content Ideas */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Generated Content Ideas ({result.ideas.length})
                </h2>
                <div className="space-y-4">
                  {result.ideas.map((idea, index) => (
                    <IdeaCard key={idea.id} idea={idea} index={index} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
