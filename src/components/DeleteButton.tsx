'use client';

import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';

export default function DeleteButton({ id, action }: { id: string, action: (id: string) => Promise<void> }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this?')) {
      startTransition(async () => {
        await action(id);
      });
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isPending}
      className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4 mr-1" />
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
