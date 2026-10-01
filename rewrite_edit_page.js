const fs = require('fs');

const content = `import { query as dbQuery } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TransactionForm from '@/components/TransactionForm';
import { updateTransaction } from '../../actions';

export default async function EditTransactionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const returnTo = sParams?.returnTo || '/transactions';

  const transactionRes = await dbQuery('SELECT * FROM "Transaction" WHERE id = $1', [id]);
  
  if (transactionRes.rows.length === 0) notFound();
  
  const transaction = transactionRes.rows[0];

  const customersRes = await dbQuery('SELECT * FROM "Customer" ORDER BY name ASC');
  const customers = customersRes.rows;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link href={returnTo} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Transaction</h1>
      </div>
      
      <TransactionForm 
        customers={customers} 
        saveAction={updateTransaction.bind(null, id)} 
        defaultCustomerId={transaction.customerId}
        defaultType={transaction.type}
        initialData={transaction}
        returnTo={returnTo}
      />
    </div>
  );
}
`;

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/[id]/edit/page.tsx', content, 'utf8');
