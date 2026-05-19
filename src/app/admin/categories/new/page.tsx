'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FormField from '@/components/admin/FormField';
import { createCategory } from '@/lib/actions/admin';

export default function NewCategoryPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    image_url: '',
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
    formData.set('name', form.name);
    formData.set('description', form.description);
    if (form.image_url) formData.set('image_url', form.image_url);

    const result = await createCategory(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push('/admin/categories');
    router.refresh();
  };

  return (
    <div>
      <Link
        href="/admin/categories"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to categories
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">New Category</h1>
      <p className="mt-1 text-sm text-gray-600">Create a new product category.</p>

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
            {isSubmitting ? 'Creating...' : 'Create Category'}
          </button>
          <Link
            href="/admin/categories"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
