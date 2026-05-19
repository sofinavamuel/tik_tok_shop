import type { Metadata } from 'next';
import ProductsTableClient from './products-table-client';
import { getProducts } from '@/lib/admin';

export const metadata: Metadata = {
  title: 'Products',
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search;
  const page = Number(params.page) || 1;
  const limit = 10;

  const { data: products, count, error } = await getProducts(search, page, limit);
  const totalPages = Math.ceil(count / limit);

  return (
    <ProductsTableClient
      products={products ?? []}
      count={count}
      search={search}
      page={page}
      totalPages={totalPages}
    />
  );
}
