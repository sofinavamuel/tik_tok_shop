import type { Metadata } from 'next';
import CategoriesTableClient from './categories-table-client';
import { getCategoriesWithProductCount } from '@/lib/admin';

export const metadata: Metadata = {
  title: 'Categories',
};

export default async function AdminCategoriesPage() {
  const { data: categories } = await getCategoriesWithProductCount();

  return (
    <CategoriesTableClient categories={categories ?? []} />
  );
}
