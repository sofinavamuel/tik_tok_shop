'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ExternalLink } from 'lucide-react';
import { getVideo } from '@/lib/strapi/client';
import { analyzeVideoAction } from '@/lib/actions/strapi';

interface AnalysisData {
  hook?: {
    type: string;
    text: string;
    emotion: string;
    effectiveness: number;
  };
  structure?: {
    type: string;
    segments: Array<{ timestamp: string; description: string }>;
  };
  cta?: {
    type: string;
    text: string;
    placement: string;
  };
  sentiment?: {
    overall: string;
    score: number;
    keywords: string[];
  };
  targetAudience?: {
    demographics: string[];
    painPoints: string[];
    desires: string[];
  };
  recommendations?: string[];
}

export default function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolved) => setId(resolved.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    getVideo(id).then((res) => {
      if (!res.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setVideo(res.data);
      setLoading(false);
    });
  }, [id]);

  const handleAnalyze = async () => {
    if (!id) return;
    setAnalyzing(true);
    setError(null);

    const result = await analyzeVideoAction(Number(id));

    if (result.error) {
      setError(result.error);
      setAnalyzing(false);
      return;
    }

    // Refresh the video data
    getVideo(id).then((res) => {
      if (res.data) {
        setVideo(res.data);
      }
    });
    setAnalyzing(false);
  };

  if (loading) {
    return (
      <div>
        <div className="mb-6 h-5 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-8 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !video) {
    return (
      <div>
        <Link
          href="/admin/videos"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to videos
        </Link>
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Video Not Found</h2>
          <p className="mt-2 text-sm text-gray-500">
            The video you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/admin/videos"
            className="mt-6 inline-block rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Back to Videos
          </Link>
        </div>
      </div>
    );
  }

  const tiktokUrl = video.tiktok_url || '';
  const analysis: AnalysisData | null = video.analysis_json || null;
  const hasAnalysis = analysis && Object.keys(analysis).length > 0;

  return (
    <div>
      <Link
        href="/admin/videos"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to videos
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Details</h1>
          <p className="mt-1 text-sm text-gray-600">
            {tiktokUrl ? (
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                {tiktokUrl}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              `Video #${video.id}`
            )}
          </p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          {analyzing ? 'Analyzing...' : hasAnalysis ? 'Re-analyze with AI' : 'Analyze with AI'}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Metadata */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Views</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {(video.views ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Likes</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {(video.likes ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Shares</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {(video.shares ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Comments</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {(video.comments ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Additional metadata */}
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Duration</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {video.duration_seconds ? `${video.duration_seconds}s` : 'N/A'}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">GMV Attributed</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {video.gmv_attributed ? `€${video.gmv_attributed.toLocaleString()}` : 'N/A'}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Hook Text</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {video.hook_text || 'N/A'}
          </p>
        </div>
      </div>

      {/* Transcript */}
      {video.transcript && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Transcript</h2>
          <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{video.transcript}</p>
        </div>
      )}

      {/* AI Analysis Results */}
      {hasAnalysis && (
        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">AI Analysis Results</h2>

          {/* Hook */}
          {analysis.hook && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Hook</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="text-sm font-medium text-gray-900">{analysis.hook.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Emotion</p>
                  <p className="text-sm font-medium text-gray-900">{analysis.hook.emotion}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Effectiveness</p>
                  <p className="text-sm font-medium text-gray-900">
                    {analysis.hook.effectiveness}/10
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Text</p>
                  <p className="text-sm font-medium text-gray-900">{analysis.hook.text}</p>
                </div>
              </div>
            </div>
          )}

          {/* Structure */}
          {analysis.structure && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Structure</h3>
              <p className="mt-1 text-sm text-gray-600">Type: {analysis.structure.type}</p>
              {analysis.structure.segments && analysis.structure.segments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {analysis.structure.segments.map((seg, i) => (
                    <div key={i} className="flex gap-4 text-sm">
                      <span className="font-mono text-gray-500">{seg.timestamp}</span>
                      <span className="text-gray-700">{seg.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          {analysis.cta && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Call to Action</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="text-sm font-medium text-gray-900">{analysis.cta.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Placement</p>
                  <p className="text-sm font-medium text-gray-900">{analysis.cta.placement}</p>
                </div>
                <div className="sm:col-span-1">
                  <p className="text-sm text-gray-500">Text</p>
                  <p className="text-sm font-medium text-gray-900">{analysis.cta.text}</p>
                </div>
              </div>
            </div>
          )}

          {/* Sentiment */}
          {analysis.sentiment && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Sentiment</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">Overall</p>
                  <p
                    className={`text-sm font-medium ${
                      analysis.sentiment.overall === 'positive'
                        ? 'text-green-600'
                        : analysis.sentiment.overall === 'negative'
                          ? 'text-red-600'
                          : 'text-gray-600'
                    }`}
                  >
                    {analysis.sentiment.overall}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Score</p>
                  <p className="text-sm font-medium text-gray-900">
                    {analysis.sentiment.score}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Keywords</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {analysis.sentiment.keywords?.map((kw, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Target Audience */}
          {analysis.targetAudience && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Target Audience</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">Demographics</p>
                  <ul className="mt-1 list-disc pl-4 text-sm text-gray-700">
                    {analysis.targetAudience.demographics?.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pain Points</p>
                  <ul className="mt-1 list-disc pl-4 text-sm text-gray-700">
                    {analysis.targetAudience.painPoints?.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Desires</p>
                  <ul className="mt-1 list-disc pl-4 text-sm text-gray-700">
                    {analysis.targetAudience.desires?.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
              <ul className="mt-3 space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
