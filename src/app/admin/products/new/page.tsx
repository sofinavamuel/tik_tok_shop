'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FormField from '@/components/admin/FormField';
import { createProduct } from '@/lib/actions/admin';
import { getCategories } from '@/lib/admin';
import type { Category } from '@/types';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    material: '',
    origin: '',
    in_stock: true,
    image_url: '',
  });

  useEffect(() => {
    getCategories().then((res) => {
      if (res.data) setCategories(res.data);
    });
  }, []);

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
    formData.set('description', form.description);
    formData.set('price', form.price);
    formData.set('category_id', form.category_id);
    formData.set('material', form.material);
    formData.set('origin', form.origin);
    formData.set('in_stock', form.in_stock ? 'on' : 'off');
    if (form.image_url) formData.set('image_url', form.image_url);

    const result = await createProduct(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push('/admin/products');
    router.refresh();
  };

  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">New Product</h1>
      <p className="mt-1 text-sm text-gray-600">Add a new product to your store.</p>

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
            placeholder="Product name"
          />
          <FormField
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            placeholder="0.00"
            min={0}
            step={0.01}
          />
        </div>

        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={form.description}
          onChange={handleChange}
          placeholder="Product description"
          rows={4}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Category"
            name="category_id"
            type="select"
            value={form.category_id}
            onChange={handleChange}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
          <FormField
            label="Material"
            name="material"
            value={form.material}
            onChange={handleChange}
            placeholder="e.g. Cotton, Polyester"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Origin"
            name="origin"
            value={form.origin}
            onChange={handleChange}
            placeholder="e.g. China, USA"
          />
          <FormField
            label="Image URL"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="in_stock"
            checked={form.in_stock}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <span className="text-sm font-medium text-gray-700">In Stock</span>
        </label>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </button>
          <Link
            href="/admin/products"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
