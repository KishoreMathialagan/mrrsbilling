'use client';

import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteTransaction } from '@/app/(app)/transactions/actions';
import { useTransition } from 'react';

export default function TransactionActions({ id, returnTo = "/transactions" }: { id: string, returnTo?: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      startTransition(async () => {
        await deleteTransaction(id);
      });
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Link href={`/transactions/${id}/edit?returnTo=${encodeURIComponent(returnTo)}`} className="text-gray-400 hover:text-blue-600 transition-colors">
        <Edit className="w-4 h-4" />
      </Link>
      <button 
        onClick={handleDelete} 
        disabled={isPending}
        className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
