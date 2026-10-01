import { saveReceipt } from '../actions';
import { query as dbQuery } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ReceiptForm from '@/components/ReceiptForm';

export default async function NewReceiptPage() {
  const customersRes = await dbQuery('SELECT * FROM "Customer" ORDER BY name ASC');
  const customers = customersRes.rows;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/receipts" className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create Receipt</h1>
      </div>
      
      <ReceiptForm customers={customers} saveAction={saveReceipt} />
    </div>
  );
}
