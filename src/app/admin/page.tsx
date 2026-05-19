import { Package, FolderTree, ShoppingCart, DollarSign } from 'lucide-react';
import type { Metadata } from 'next';
import { insforge } from '@/lib/insforge';

export const metadata: Metadata = {
  title: 'Dashboard',
};

async function getStats() {
  const [productsRes, categoriesRes, ordersRes] = await Promise.all([
    insforge.database.from('products').select('*', { count: 'exact', head: true }),
    insforge.database.from('categories').select('*', { count: 'exact', head: true }),
    insforge.database.from('orders').select('*', { count: 'exact', head: true }),
  ]);

  return {
    productCount: productsRes.count ?? 0,
    categoryCount: categoriesRes.count ?? 0,
    orderCount: ordersRes.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const { productCount, categoryCount, orderCount } = await getStats();

  const stats = [
    {
      label: 'Total Products',
      value: productCount,
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Categories',
      value: categoryCount,
      icon: FolderTree,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Orders',
      value: orderCount,
      icon: ShoppingCart,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Revenue',
      value: `$${orderCount > 0 ? '—' : '0'}`,
      icon: DollarSign,
      color: 'bg-violet-100 text-violet-600',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600">
        Welcome to the admin panel. Here is an overview of your store.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Recent orders, product updates, and other activity will appear here.
          </p>
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
              >
                <div className="h-8 w-8 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-3/4 rounded bg-gray-100" />
                  <div className="h-2 w-1/2 rounded bg-gray-50" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Quick Actions
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Common administrative tasks.
          </p>
          <div className="mt-4 space-y-2">
            <a
              href="/admin/products/new"
              className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Package className="h-4 w-4 text-gray-400" />
              Add new product
            </a>
            <a
              href="/admin/categories/new"
              className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FolderTree className="h-4 w-4 text-gray-400" />
              Create new category
            </a>
            <a
              href="/admin/orders"
              className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ShoppingCart className="h-4 w-4 text-gray-400" />
              View orders
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
