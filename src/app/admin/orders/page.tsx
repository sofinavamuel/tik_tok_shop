import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders',
};

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      <p className="mt-1 text-sm text-gray-600">
        View and manage customer orders.
      </p>

      <div className="mt-8 rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-sm text-gray-500">
          Order management table with status updates and invoice downloads
          coming soon.
        </p>
      </div>
    </div>
  );
}
