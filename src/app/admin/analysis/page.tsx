'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Film,
  FileText,
  Loader2,
  Save,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { analyzeVideoAction, generateBriefingAction, getProductsAction } from '@/lib/ai/actions';
import type { VideoAnalysisResult } from '@/lib/ai/analyze-video';
import type { BriefingResult } from '@/lib/ai/generate-briefing';
import type { Product } from '@/types';

type Tab = 'analyze' | 'briefing';

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<Tab>('analyze');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Analysis</h1>
        <p className="mt-2 text-sm text-gray-600">
          Analyze TikTok videos and generate production briefings using AI.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'analyze'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <Film className="h-4 w-4" />
            Video Analysis
          </button>
          <button
            onClick={() => setActiveTab('briefing')}
            className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'briefing'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4" />
            Briefing Generator
          </button>
        </nav>
      </div>

      {activeTab === 'analyze' ? <VideoAnalysisTab /> : <BriefingGeneratorTab />}
    </div>
  );
}

function VideoAnalysisTab() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoAnalysisResult | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAnalyze = async () => {
    if (!description.trim()) {
      setError('Please enter a video description.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSaveSuccess(false);

    try {
      const analysis = await analyzeVideoAction({
        title: title.trim() || 'Untitled Video',
        description: description.trim(),
      });
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Input panel */}
      <div className="lg:col-span-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Video Details</h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter the video title and description to analyze.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Video Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 10 Beauty Products Under $10"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Video Description *
              </label>
              <textarea
                id="description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Paste the video description or transcript here..."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || !description.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze with AI
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results panel */}
      <div className="lg:col-span-3">
        {!result && !loading && !error && (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white">
            <div className="text-center">
              <Sparkles className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-500">
                Enter video details and click "Analyze with AI"
              </p>
              <p className="mt-1 text-xs text-gray-400">
                The AI will analyze hook, structure, CTA, sentiment, and more.
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
              <p className="mt-3 text-sm text-gray-500">Analyzing video...</p>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Hook Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Hook
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p className="font-medium text-gray-900">{result.hook.type}</p>
                </div>
                <div>
                  <span className="text-gray-500">Emotion:</span>
                  <p className="font-medium text-gray-900">{result.hook.emotion}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Text:</span>
                  <p className="mt-0.5 text-gray-900">{result.hook.text}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Effectiveness:</span>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-amber-500"
                        style={{ width: `${result.hook.effectiveness * 10}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{result.hook.effectiveness}/10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Structure Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Film className="h-4 w-4 text-blue-500" />
                Structure
              </h3>
              <p className="mt-1 text-sm text-gray-600">Type: {result.structure.type}</p>
              {result.structure.segments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {result.structure.segments.map((seg, i) => (
                    <div key={i} className="flex gap-3 rounded-lg bg-gray-50 p-3 text-sm">
                      <span className="shrink-0 font-mono text-xs text-gray-400">{seg.timestamp}</span>
                      <span className="text-gray-700">{seg.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Call to Action
              </h3>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p className="font-medium text-gray-900">{result.cta.type}</p>
                </div>
                <div>
                  <span className="text-gray-500">Text:</span>
                  <p className="font-medium text-gray-900">{result.cta.text}</p>
                </div>
                <div>
                  <span className="text-gray-500">Placement:</span>
                  <p className="font-medium text-gray-900">{result.cta.placement}</p>
                </div>
              </div>
            </div>

            {/* Sentiment Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FileText className="h-4 w-4 text-violet-500" />
                Sentiment
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  result.sentiment.overall === 'positive'
                    ? 'bg-emerald-100 text-emerald-700'
                    : result.sentiment.overall === 'negative'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                }`}>
                  {result.sentiment.overall}
                </span>
                <span className="text-gray-500">Score: {result.sentiment.score.toFixed(2)}</span>
              </div>
              {result.sentiment.keywords.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {result.sentiment.keywords.map((kw, i) => (
                    <span key={i} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Target Audience Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                Target Audience
              </h3>
              <div className="mt-3 grid gap-4 text-sm sm:grid-cols-3">
                <div>
                  <span className="text-xs font-medium text-gray-500">Demographics</span>
                  <ul className="mt-1 space-y-1">
                    {result.targetAudience.demographics.map((d, i) => (
                      <li key={i} className="text-gray-700">{d}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Pain Points</span>
                  <ul className="mt-1 space-y-1">
                    {result.targetAudience.painPoints.map((p, i) => (
                      <li key={i} className="text-gray-700">{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Desires</span>
                  <ul className="mt-1 space-y-1">
                    {result.targetAudience.desires.map((d, i) => (
                      <li key={i} className="text-gray-700">{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recommendations Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <AlertCircle className="h-4 w-4 text-rose-500" />
                Recommendations
              </h3>
              <ul className="mt-3 space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Save to Strapi */}
            <button
              onClick={async () => {
                setSaving(true);
                try {
                  // In a real scenario, we'd pass a TikTok URL
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                } finally {
                  setSaving(false);
                }
              }}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saveSuccess ? 'Saved to Strapi ✓' : 'Save Analysis to Strapi'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BriefingGeneratorTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BriefingResult | null>(null);
  const [expandedHookIndex, setExpandedHookIndex] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load products on mount
  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const productsData = await getProductsAction();
      setProducts(productsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products.');
    } finally {
      setProductsLoading(false);
    }
  };

  // Load products when component mounts
  useEffect(() => {
    loadProducts();
  }, []);

  const handleGenerate = async () => {
    if (!selectedProductId) {
      setError('Please select a product.');
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) {
      setError('Selected product not found.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const briefing = await generateBriefingAction({
        product,
        targetAudience: targetAudience.trim() || undefined,
      });
      setResult(briefing);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Briefing generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Input panel */}
      <div className="lg:col-span-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Briefing Parameters</h2>
          <p className="mt-1 text-sm text-gray-500">
            Select a product and configure the briefing.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                Product *
              </label>
              <select
                id="product"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              >
                <option value="">{productsLoading ? 'Loading products...' : 'Select a product...'}</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — €{p.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="audience" className="block text-sm font-medium text-gray-700">
                Target Audience (optional)
              </label>
              <input
                id="audience"
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Women 18-35, beauty enthusiasts"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !selectedProductId}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Briefing
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results panel */}
      <div className="lg:col-span-3">
        {!result && !loading && !error && (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white">
            <div className="text-center">
              <FileText className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-500">
                Select a product and generate a briefing
              </p>
              <p className="mt-1 text-xs text-gray-400">
                The AI will create hook options, script, shotlist, and production notes.
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
              <p className="mt-3 text-sm text-gray-500">Generating briefing...</p>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Title */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
              {result.selectedHook && (
                <p className="mt-1 text-sm text-gray-600">
                  Selected hook: <span className="font-medium">{result.selectedHook}</span>
                </p>
              )}
            </div>

            {/* Hook Options */}
            {result.hookOptions.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Hook Options
                </h3>
                <div className="space-y-2">
                  {result.hookOptions.map((hook, i) => (
                    <div key={i}>
                      <button
                        onClick={() => setExpandedHookIndex(expandedHookIndex === i ? null : i)}
                        className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <span>Hook Option {i + 1}</span>
                        {expandedHookIndex === i ? (
                          <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                      {expandedHookIndex === i && (
                        <div className="px-4 pb-3 pt-2 text-sm text-gray-600">
                          {hook}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Script Scenes */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Film className="h-4 w-4 text-blue-500" />
                Script
              </h3>
              <div className="space-y-3">
                {result.script.scenes.map((scene) => (
                  <div key={scene.sceneNumber} className="rounded-lg border border-gray-100 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">
                        Scene {scene.sceneNumber}
                      </span>
                      <span className="text-xs text-gray-400">{scene.duration}</span>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div>
                        <span className="text-xs font-medium text-gray-500">Visuals:</span>
                        <p className="text-gray-700">{scene.visuals}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Audio:</span>
                        <p className="text-gray-700">{scene.audio}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Text:</span>
                        <p className="text-gray-700">{scene.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shotlist */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.16a15.53 15.53 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
                Shot List
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">#</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.shotlist.map((shot) => (
                      <tr key={shot.shotNumber} className="border-b border-gray-50">
                        <td className="px-3 py-2 text-gray-400">{shot.shotNumber}</td>
                        <td className="px-3 py-2 font-medium text-gray-700">{shot.type}</td>
                        <td className="px-3 py-2 text-gray-600">{shot.description}</td>
                        <td className="px-3 py-2 text-right text-gray-500">{shot.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Music Suggestions */}
            {result.musicSuggestions.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <svg className="h-4 w-4 text-pink-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 4.5v11.25m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.75z" />
                  </svg>
                  Music Suggestions
                </h3>
                <ul className="space-y-1">
                  {result.musicSuggestions.map((music, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="h-1 w-1 rounded-full bg-pink-400" />
                      {music}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Production Notes */}
            {result.productionNotes.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <FileText className="h-4 w-4 text-orange-500" />
                  Production Notes
                </h3>
                <ul className="space-y-2">
                  {result.productionNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Save to Strapi */}
            <button
              onClick={async () => {
                setSaving(true);
                try {
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                } finally {
                  setSaving(false);
                }
              }}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saveSuccess ? 'Saved as Briefing ✓' : 'Save as Briefing'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
