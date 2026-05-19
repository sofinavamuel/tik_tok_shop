'use client';

import DataTable from '@/components/admin/DataTable';

interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-600',
  processing: 'bg-blue-100 text-blue-700',
};

function StatusBadge({ status }: { status: string }) {
  const color = statusColors[status.toLowerCase()] ?? 'bg-gray-100 text-gray-600';
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${color}`}
    >
      {status}
    </span>
  );
}

interface OrdersTableClientProps {
  orders: Order[];
}

export default function OrdersTableClient({ orders }: OrdersTableClientProps) {
  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (order: Order) => (
        <span className="font-mono text-xs">{order.id}</span>
      ),
    },
    { key: 'customer', label: 'Customer' },
    {
      key: 'items',
      label: 'Items',
      render: (order: Order) => (
        <span className="font-medium">{order.items}</span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      render: (order: Order) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(order.total),
    },
    {
      key: 'status',
      label: 'Status',
      render: (order: Order) => <StatusBadge status={order.status} />,
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (order: Order) =>
        new Date(order.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={orders}
      emptyMessage="No orders yet. Orders will appear here once customers start purchasing."
      keyExtractor={(order: Order) => order.id}
    />
  );
}
