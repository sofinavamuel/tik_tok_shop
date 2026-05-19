'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FormField from '@/components/admin/FormField';
import { createCreatorAction } from '@/lib/actions/strapi';

export default function NewCreatorPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    username: '',
    display_name: '',
    followers: '',
    engagement_rate: '',
    avg_views: '',
    niche: '',
    notes: '',
    avatar_url: '',
    tiktok_handle: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.set('username', form.username);
    formData.set('display_name', form.display_name);
    formData.set('followers', form.followers || '0');
    formData.set('engagement_rate', form.engagement_rate || '0');
    formData.set('avg_views', form.avg_views || '0');
    formData.set('niche', form.niche);
    formData.set('notes', form.notes);
    formData.set('avatar_url', form.avatar_url);
    formData.set('tiktok_handle', form.tiktok_handle);

    const result = await createCreatorAction(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push('/admin/creators');
    router.refresh();
  };

  return (
    <div>
      <Link
        href="/admin/creators"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to creators
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">New Creator</h1>
      <p className="mt-1 text-sm text-gray-600">Add a new TikTok creator.</p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="e.g. @creator123"
          />
          <FormField
            label="Display Name"
            name="display_name"
            value={form.display_name}
            onChange={handleChange}
            required
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Followers"
            name="followers"
            type="number"
            value={form.followers}
            onChange={handleChange}
            placeholder="0"
            min={0}
          />
          <FormField
            label="Engagement Rate (%)"
            name="engagement_rate"
            type="number"
            value={form.engagement_rate}
            onChange={handleChange}
            placeholder="0"
            step={0.1}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Avg Views"
            name="avg_views"
            type="number"
            value={form.avg_views}
            onChange={handleChange}
            placeholder="0"
            min={0}
          />
          <FormField
            label="Niche"
            name="niche"
            value={form.niche}
            onChange={handleChange}
            required
            placeholder="e.g. Fashion, Tech, Food"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="TikTok Handle"
            name="tiktok_handle"
            value={form.tiktok_handle}
            onChange={handleChange}
            placeholder="e.g. @creator123"
          />
          <FormField
            label="Avatar URL"
            name="avatar_url"
            value={form.avatar_url}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <FormField
          label="Notes"
          name="notes"
          type="textarea"
          value={form.notes}
          onChange={handleChange}
          placeholder="Additional notes about this creator..."
          rows={3}
        />

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Creator'}
          </button>
          <Link
            href="/admin/creators"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
