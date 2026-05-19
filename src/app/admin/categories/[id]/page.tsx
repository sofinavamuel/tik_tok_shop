'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FormField from '@/components/admin/FormField';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { getCategory } from '@/lib/admin';
import { updateCategory, deleteCategory } from '@/lib/actions/admin';
import type { Category } from '@/types';

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    image_url: '',
  });

  // Resolve params
  useEffect(() => {
    params.then((resolved) => setId(resolved.id));
  }, [params]);

  // Fetch category
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    getCategory(id).then((res) => {
      if (res.error || !res.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const c = res.data;
      setCategory(c);
      setForm({
        name: c.name,
        description: c.description ?? '',
        image_url: c.image_url ?? '',
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
    formData.set('name', form.name);
    formData.set('description', form.description);
    if (form.image_url) formData.set('image_url', form.image_url);

    const result = await updateCategory(id, formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push('/admin/categories');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);

    const result = await deleteCategory(id);

    if (result.error) {
      setError(result.error);
      setIsDeleting(false);
      setShowDelete(false);
      return;
    }

    router.push('/admin/categories');
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

  if (notFound || !category) {
    return (
      <div>
        <Link
          href="/admin/categories"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to categories
        </Link>
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Category Not Found</h2>
          <p className="mt-2 text-sm text-gray-500">
            The category you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/admin/categories"
            className="mt-6 inline-block rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/categories"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to categories
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
          <p className="mt-1 text-sm text-gray-600">{category.name}</p>
        </div>
        <button
          onClick={() => setShowDelete(true)}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete Category
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-6">
        <FormField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Category name"
        />

        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={form.description}
          onChange={handleChange}
          placeholder="Category description"
          rows={3}
        />

        <FormField
          label="Image URL"
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="https://example.com/category.jpg"
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
            href="/admin/categories"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
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
