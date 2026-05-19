'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { deleteProduct, deleteCategory } from '@/lib/actions/admin';

interface DeleteButtonProps {
  id: string;
  type: 'product' | 'category';
  label: string;
  onSuccess?: () => void;
}

export default function DeleteButton({ id, type, label, onSuccess }: DeleteButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    const result =
      type === 'product'
        ? await deleteProduct(id)
        : await deleteCategory(id);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setShowConfirm(false);
    setIsLoading(false);
    onSuccess?.();
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
        title={`Delete ${type}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setError(null)} />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-red-600">Error</h3>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showConfirm}
        title={`Delete ${type}`}
        message={`Are you sure you want to delete "${label}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirm(false);
          setError(null);
        }}
        isLoading={isLoading}
      />
    </>
  );
}
