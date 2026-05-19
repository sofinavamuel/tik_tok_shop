'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FormField from '@/components/admin/FormField';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { getCreator } from '@/lib/strapi/client';
import { updateCreatorAction, deleteCreatorAction } from '@/lib/actions/strapi';

export default function EditCreatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    params.then((resolved) => setId(resolved.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    getCreator(id).then((res) => {
      if (!res.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const c = res.data;
      setCreator(c);
      setForm({
        username: c.username || '',
        display_name: c.display_name || '',
        followers: String(c.followers ?? 0),
        engagement_rate: String(c.engagement_rate ?? 0),
        avg_views: String(c.avg_views ?? 0),
        niche: c.niche || '',
        notes: c.notes || '',
        avatar_url: c.avatar_url || '',
        tiktok_handle: c.tiktok_handle || '',
      });
      setLoading(false);
    });
  }, [id]);

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
    formData.set('username', form.username);
    formData.set('display_name', form.display_name);
    formData.set('followers', form.followers || '0');
    formData.set('engagement_rate', form.engagement_rate || '0');
    formData.set('avg_views', form.avg_views || '0');
    formData.set('niche', form.niche);
    formData.set('notes', form.notes);
    formData.set('avatar_url', form.avatar_url);
    formData.set('tiktok_handle', form.tiktok_handle);

    const result = await updateCreatorAction(Number(id), formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push('/admin/creators');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);

    const result = await deleteCreatorAction(Number(id));

    if (result.error) {
      setError(result.error);
      setIsDeleting(false);
      setShowDelete(false);
      return;
    }

    router.push('/admin/creators');
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

  if (notFound || !creator) {
    return (
      <div>
        <Link
          href="/admin/creators"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to creators
        </Link>
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Creator Not Found</h2>
          <p className="mt-2 text-sm text-gray-500">
            The creator you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/admin/creators"
            className="mt-6 inline-block rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Back to Creators
          </Link>
        </div>
      </div>
    );
  }

  const displayName = creator.display_name || 'Creator';

  return (
    <div>
      <Link
        href="/admin/creators"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to creators
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Creator</h1>
          <p className="mt-1 text-sm text-gray-600">{displayName}</p>
        </div>
        <button
          onClick={() => setShowDelete(true)}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete Creator
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/admin/creators"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete Creator"
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
