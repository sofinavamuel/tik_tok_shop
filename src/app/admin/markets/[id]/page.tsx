'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FormField from '@/components/admin/FormField';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { getMarket } from '@/lib/strapi/client';
import { updateMarketAction, deleteMarketAction } from '@/lib/actions/strapi';

export default function EditMarketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [market, setMarket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    currency: '',
    language: '',
    tiktok_shop_active: true,
    gmv_total: '',
    growth_rate: '',
    saturation_score: '',
  });

  useEffect(() => {
    params.then((resolved) => setId(resolved.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    getMarket(id).then((res) => {
      if (!res.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const m = res.data;
      setMarket(m);
      setForm({
        name: m.name || '',
        slug: m.slug || '',
        currency: m.currency || '',
        language: m.language || '',
        tiktok_shop_active: m.tiktok_shop_active ?? true,
        gmv_total: String(m.gmv_total ?? 0),
        growth_rate: String(m.growth_rate ?? 0),
        saturation_score: String(m.saturation_score ?? 0),
      });
      setLoading(false);
    });
  }, [id]);

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
    if (!id) return;
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.set('name', form.name);
    formData.set('slug', form.slug);
    formData.set('currency', form.currency);
    formData.set('language', form.language);
    formData.set('tiktok_shop_active', form.tiktok_shop_active ? 'on' : '');
    formData.set('gmv_total', form.gmv_total || '0');
    formData.set('growth_rate', form.growth_rate || '0');
    formData.set('saturation_score', form.saturation_score || '0');

    const result = await updateMarketAction(Number(id), formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push('/admin/markets');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);

    const result = await deleteMarketAction(Number(id));

    if (result.error) {
      setError(result.error);
      setIsDeleting(false);
      setShowDelete(false);
      return;
    }

    router.push('/admin/markets');
    router.refresh();
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

  if (notFound || !market) {
    return (
      <div>
        <Link
          href="/admin/markets"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to markets
        </Link>
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Market Not Found</h2>
          <p className="mt-2 text-sm text-gray-500">
            The market you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/admin/markets"
            className="mt-6 inline-block rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Back to Markets
          </Link>
        </div>
      </div>
    );
  }

  const displayName = market.name || 'Market';

  return (
    <div>
      <Link
        href="/admin/markets"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to markets
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Market</h1>
          <p className="mt-1 text-sm text-gray-600">{displayName}</p>
        </div>
        <button
          onClick={() => setShowDelete(true)}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete Market
        </button>
      </div>

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
            label="Slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            placeholder="e.g. united-kingdom"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            required
            placeholder="e.g. GBP"
          />
          <FormField
            label="Language"
            name="language"
            value={form.language}
            onChange={handleChange}
            required
            placeholder="e.g. English"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="GMV Total"
            name="gmv_total"
            type="number"
            value={form.gmv_total}
            onChange={handleChange}
            placeholder="0"
            min={0}
          />
          <FormField
            label="Growth Rate (%)"
            name="growth_rate"
            type="number"
            value={form.growth_rate}
            onChange={handleChange}
            placeholder="0"
            step={0.1}
          />
        </div>

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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/admin/markets"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete Market"
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
