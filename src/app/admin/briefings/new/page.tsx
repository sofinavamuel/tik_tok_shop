'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import FormField from '@/components/admin/FormField';
import { createBriefing } from '@/lib/strapi/client';
import { generateBriefingAction, getProductsAction } from '@/lib/ai/actions';
import type { Product } from '@/types';
import type { BriefingResult } from '@/lib/ai/generate-briefing';

export default function NewBriefingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [generatedBriefing, setGeneratedBriefing] = useState<BriefingResult | null>(null);

  const [form, setForm] = useState({
    title: '',
    target_audience: '',
  });

  useEffect(() => {
    getProductsAction().then(setProducts).catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateAI = async () => {
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

      setGeneratedBriefing(result);
      setForm((prev) => ({
        ...prev,
        title: result.title,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate briefing');
    }

    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data: Record<string, unknown> = {
        title: form.title,
        target_audience: form.target_audience,
        status: 'draft',
        ai_generated: !!generatedBriefing,
      };

      if (generatedBriefing) {
        data.hook_options = generatedBriefing.hookOptions;
        data.script = JSON.stringify(generatedBriefing.script);
        data.shotlist = generatedBriefing.shotlist;
      }

      await createBriefing(data);

      router.push('/admin/briefings');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create briefing');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/briefings"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to briefings
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">New Briefing</h1>
      <p className="mt-1 text-sm text-gray-600">Create a new video production briefing.</p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        {/* AI Generation */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Generate with AI</h2>
          <p className="mt-1 text-sm text-gray-500">
            Select a product to generate a briefing automatically.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Generated Content Preview */}
        {generatedBriefing && (
          <div className="space-y-4">
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-6">
              <h2 className="text-lg font-semibold text-purple-900">Generated Content</h2>

              {generatedBriefing.hookOptions.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-purple-800">Hook Options</p>
                  <ul className="mt-1 space-y-1">
                    {generatedBriefing.hookOptions.map((hook, i) => (
                      <li key={i} className="text-sm text-purple-700">
                        &bull; {hook}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {generatedBriefing.script.scenes && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-purple-800">
                    Script ({generatedBriefing.script.scenes.length} scenes)
                  </p>
                </div>
              )}

              {generatedBriefing.shotlist && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-purple-800">
                    Shotlist ({generatedBriefing.shotlist.length} shots)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manual Form */}
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

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Briefing'}
          </button>
          <Link
            href="/admin/briefings"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
