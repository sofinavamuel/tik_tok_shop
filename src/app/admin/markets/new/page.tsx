'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FormField from '@/components/admin/FormField';
import { createMarketAction } from '@/lib/actions/strapi';

export default function NewMarketPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    currency: '',
    language: '',
    tiktok_shop_active: true,
    gmv_total: '',
    growth_rate: '',
    saturation_score: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.set('name', form.name);
    formData.set('currency', form.currency);
    formData.set('language', form.language);
    formData.set('tiktok_shop_active', form.tiktok_shop_active ? 'on' : '');
    formData.set('gmv_total', form.gmv_total || '0');
    formData.set('growth_rate', form.growth_rate || '0');
    formData.set('saturation_score', form.saturation_score || '0');

    const result = await createMarketAction(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push('/admin/markets');
    router.refresh();
  };

  return (
    <div>
      <Link
        href="/admin/markets"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to markets
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">New Market</h1>
      <p className="mt-1 text-sm text-gray-600">Add a new TikTok Shop market.</p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. United Kingdom"
          />
          <FormField
            label="Currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            required
            placeholder="e.g. GBP"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Language"
            name="language"
            value={form.language}
            onChange={handleChange}
            required
            placeholder="e.g. English"
          />
          <FormField
            label="GMV Total"
            name="gmv_total"
            type="number"
            value={form.gmv_total}
            onChange={handleChange}
            placeholder="0"
            min={0}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Growth Rate (%)"
            name="growth_rate"
            type="number"
            value={form.growth_rate}
            onChange={handleChange}
            placeholder="0"
            step={0.1}
          />
          <FormField
            label="Saturation Score (%)"
            name="saturation_score"
            type="number"
            value={form.saturation_score}
            onChange={handleChange}
            placeholder="0"
            min={0}
            max={100}
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="tiktok_shop_active"
            checked={form.tiktok_shop_active}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <span className="text-sm font-medium text-gray-700">TikTok Shop Active</span>
        </label>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Market'}
          </button>
          <Link
            href="/admin/markets"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
