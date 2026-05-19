import type { Metadata } from 'next';
import OrdersTableClient from './orders-table-client';

export const metadata: Metadata = {
  title: 'Orders',
};

export default async function AdminOrdersPage() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage customer orders.
        </p>
      </div>

      <div className="mt-6">
        <OrdersTableClient orders={[]} />
      </div>
    </div>
  );
}
