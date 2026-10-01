import CustomerForm from '@/components/CustomerForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { query as dbQuery } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customerRes = await dbQuery('SELECT * FROM "Customer" WHERE id = $1', [id]);
  const customer = customerRes.rows[0];

  if (!customer) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-2">
        <Link href="/customers" className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
      </div>
      <CustomerForm initialData={customer} />
    </div>
  );
}
