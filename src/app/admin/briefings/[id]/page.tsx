'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import FormField from '@/components/admin/FormField';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { getBriefing, updateBriefing } from '@/lib/strapi/client';
import {
  updateBriefingAction,
  deleteBriefingAction,
  regenerateBriefingAction,
} from '@/lib/actions/strapi';
import { generateBriefingAction, getProductsAction } from '@/lib/ai/actions';
import type { Product } from '@/types';

export default function EditBriefingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [briefing, setBriefing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const [form, setForm] = useState({
    title: '',
    target_audience: '',
    status: 'draft' as 'draft' | 'approved' | 'produced',
  });

  useEffect(() => {
    params.then((resolved) => setId(resolved.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    getBriefing(id).then((res) => {
      if (!res.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const b = res.data;
      setBriefing(b);
      setForm({
        title: b.title || '',
        target_audience: b.target_audience || '',
        status: b.status || 'draft',
      });
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    getProductsAction().then(setProducts).catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.set('title', form.title);
    formData.set('target_audience', form.target_audience);
    formData.set('status', form.status);

    const result = await updateBriefingAction(Number(id), formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push('/admin/briefings');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);

    const result = await deleteBriefingAction(Number(id));

    if (result.error) {
      setError(result.error);
      setIsDeleting(false);
      setShowDelete(false);
      return;
    }

    router.push('/admin/briefings');
    router.refresh();
  };

  const handleGenerateAI = async () => {
    if (!id) return;
    setIsGenerating(true);
    setError(null);

    const product = products.find((p) => p.id === selectedProductId) || products[0];

    if (!product) {
      setError('No products available. Add a product first.');
      setIsGenerating(false);
      return;
    }

    try {
      const result = await generateBriefingAction({
        product,
        targetAudience: form.target_audience || 'TikTok shoppers',
        market: 'General',
      });

      await updateBriefing(Number(id), {
        title: result.title,
        hook_options: result.hookOptions,
        script: JSON.stringify(result.script),
        shotlist: result.shotlist,
        ai_generated: true,
      });

      // Refresh the briefing data
      const res = await getBriefing(id);
      if (res.data) {
        setBriefing(res.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate briefing');
    }

    setIsGenerating(false);
  };

  if (loading) {
    return (
      <div>
        <div className="mb-6 h-5 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-8 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !briefing) {
    return (
      <div>
        <Link
          href="/admin/briefings"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to briefings
        </Link>
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Briefing Not Found</h2>
          <p className="mt-2 text-sm text-gray-500">
            The briefing you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/admin/briefings"
            className="mt-6 inline-block rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Back to Briefings
          </Link>
        </div>
      </div>
    );
  }

  const displayName = briefing.title || 'Briefing';
  const hookOptions = briefing.hook_options
    ? (Array.isArray(briefing.hook_options)
        ? briefing.hook_options
        : JSON.parse(briefing.hook_options || '[]'))
    : [];
  const script = briefing.script
    ? (typeof briefing.script === 'string'
        ? (() => { try { return JSON.parse(briefing.script); } catch { return null; } })()
        : briefing.script)
    : null;
  const shotlist = briefing.shotlist
    ? (Array.isArray(briefing.shotlist)
        ? briefing.shotlist
        : (() => { try { return JSON.parse(briefing.shotlist || '[]'); } catch { return null; } })())
    : null;

  return (
    <div>
      <Link
        href="/admin/briefings"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to briefings
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Briefing</h1>
          <p className="mt-1 text-sm text-gray-600">{displayName}</p>
        </div>
        <div className="flex items-center gap-3">
          {!briefing.ai_generated && (
            <div className="flex items-center gap-2">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
          )}
          <button
            onClick={() => setShowDelete(true)}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete Briefing
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* AI-Generated Content */}
      {briefing.ai_generated && (
        <div className="mt-8 space-y-6">
          {/* Hook Options */}
          {hookOptions.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Hook Options</h2>
              <ul className="mt-3 space-y-2">
                {hookOptions.map((hook: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black" />
                    {hook}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Script */}
          {script && script.scenes && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Script</h2>
              <div className="mt-3 space-y-4">
                {script.scenes.map((scene: any, i: number) => (
                  <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-black px-2 py-0.5 text-xs font-medium text-white">
                        Scene {scene.sceneNumber}
                      </span>
                      <span className="text-xs text-gray-500">{scene.duration}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      {scene.visuals}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{scene.audio}</p>
                    {scene.text && (
                      <p className="mt-1 text-sm italic text-gray-500">
                        &ldquo;{scene.text}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shotlist */}
          {shotlist && shotlist.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Shotlist</h2>
              <div className="mt-3 space-y-2">
                {shotlist.map((shot: any, i: number) => (
                  <div key={i} className="flex items-start gap-4 text-sm">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {shot.shotNumber}
                    </span>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{shot.type}</span>
                      <span className="mx-2 text-gray-400">-</span>
                      <span className="text-gray-600">{shot.description}</span>
                      <span className="ml-2 text-xs text-gray-400">({shot.duration})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="e.g. Summer Collection Launch"
          />
          <FormField
            label="Target Audience"
            name="target_audience"
            value={form.target_audience}
            onChange={handleChange}
            required
            placeholder="e.g. TikTok shoppers aged 18-34"
          />
        </div>

        <FormField
          label="Status"
          name="status"
          type="select"
          value={form.status}
          onChange={handleChange}
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'approved', label: 'Approved' },
            { value: 'produced', label: 'Produced' },
          ]}
        />

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/admin/briefings"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete Briefing"
        message={`Are you sure you want to delete "${displayName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDelete(false);
          setError(null);
        }}
        isLoading={isDeleting}
      />
    </div>
  );
}
