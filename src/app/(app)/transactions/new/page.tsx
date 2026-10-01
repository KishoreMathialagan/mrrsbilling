import { saveTransaction } from '../actions';
import { query as dbQuery } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TransactionForm from '@/components/TransactionForm';

export default async function NewTransactionPage({ searchParams }: { searchParams?: Promise<{ customerId?: string, type?: string, returnTo?: string }> }) {
  const params = await searchParams;
  const customerId = params?.customerId;
  const type = params?.type;
  
  // Default to customers/[id] if customerId is passed, else /transactions
  const returnTo = params?.returnTo || (customerId ? `/customers/${customerId}` : '/transactions');

  const customersRes = await dbQuery('SELECT * FROM "Customer" ORDER BY name ASC');
  const customers = customersRes.rows;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link href={returnTo} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">New Transaction</h1>
      </div>
      
      <TransactionForm 
        customers={customers} 
        saveAction={saveTransaction} 
        defaultCustomerId={customerId} 
        defaultType={type} 
        returnTo={returnTo}
      />
    </div>
  );
}
