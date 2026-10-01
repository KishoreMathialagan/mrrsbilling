import { query as dbQuery } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ReceiptForm from '@/components/ReceiptForm';
import { updateReceipt } from '../../actions';

export default async function EditReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const receiptRes = await dbQuery('SELECT * FROM "Receipt" WHERE id = $1', [id]);
  
  if (receiptRes.rows.length === 0) notFound();
  
  const receipt = receiptRes.rows[0];

  const customersRes = await dbQuery('SELECT * FROM "Customer" ORDER BY name ASC');
  const customers = customersRes.rows;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/receipts" className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Receipt</h1>
      </div>
      
      <ReceiptForm 
        customers={customers} 
        saveAction={updateReceipt.bind(null, id)} 
        initialData={receipt}
      />
    </div>
  );
}
