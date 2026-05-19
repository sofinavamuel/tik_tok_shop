import { Package, FolderTree, ShoppingCart, Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const stats = [
  { label: 'Total Products', value: '0', icon: Package },
  { label: 'Categories', value: '0', icon: FolderTree },
  { label: 'Orders', value: '0', icon: ShoppingCart },
  { label: 'Customers', value: '0', icon: Users },
];

export default function AdminDashboardPage() {
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
              className="rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-gray-100 p-3">
                  <Icon className="h-5 w-5 text-gray-600" />
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

      <div className="mt-8 rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-sm text-gray-500">
          Dashboard widgets and charts coming soon.
        </p>
      </div>
    </div>
  );
}
