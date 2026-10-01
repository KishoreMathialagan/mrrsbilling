import { query as dbQuery } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit2 } from 'lucide-react';
import TransactionActions from '@/components/TransactionActions';
import { format } from 'date-fns';

export default async function CustomerDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const sort = sParams.sort === 'asc' ? 'ASC' : 'DESC';

  const customerRes = await dbQuery('SELECT * FROM "Customer" WHERE id = $1', [id]);
  
  if (customerRes.rows.length === 0) notFound();
  
  const customer = customerRes.rows[0];

  const transactionsRes = await dbQuery(`SELECT * FROM "Transaction" WHERE "customerId" = $1 ORDER BY date ${sort}, "createdAt" ${sort}`, [id]);
  customer.transactions = transactionsRes.rows;

  const purchases = customer.transactions.filter((t: any) => t.type === 'PURCHASE');
  const sales = customer.transactions.filter((t: any) => t.type === 'SALE');

  const renderTable = (title: string, data: any[], type: string) => (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-black">{title}</h3>
        <Link 
          href={`/transactions/new?customerId=${customer.id}&type=${type}`} 
          className="flex items-center px-4 py-2 bg-[#111] text-white text-[12px] font-bold rounded-lg hover:bg-black transition-colors shadow-lg shadow-black/10"
        >
          <span className="mr-1">+</span> Add more
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto pb-10" >
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 group-hover:text-black w-12">S. No</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 group-hover:text-black">Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 group-hover:text-black">Item</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 group-hover:text-black text-right">Weight (Kg)</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 group-hover:text-black text-right">Touch (%)</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 group-hover:text-black text-right">Wastage (%)</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 group-hover:text-black text-right">Pure</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 group-hover:text-black text-right">Maker Charge per Kg</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 group-hover:text-black text-right">Maker Charge</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 group-hover:text-black text-right">Final Price</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 group-hover:text-black">Remark</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 group-hover:text-black text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-gray-500 group-hover:text-black">
                    No {title.toLowerCase()} found.
                  </td>
                </tr>
              ) : (
                data.map((t: any, index: number) => (
                  <tr key={t.id} className="hover:bg-gray-200 transition-colors text-black group relative">
                    <td className="px-4 py-3 text-gray-500 group-hover:text-black text-sm font-medium relative">
                      {index + 1}
                      <div className="absolute left-10 top-full mt-1 hidden group-hover:flex flex-col z-[100] bg-gray-300 text-black text-[11px] px-2 py-1.5 rounded shadow-sm whitespace-nowrap opacity-100">
                        <div>Created by: {t.createdBy || 'System Admin'} at {format(new Date(t.createdAt), 'dd MMM yyyy, HH:mm')}</div>
                        <div>Updated by: {t.updatedBy || 'System Admin'} at {format(new Date(t.updatedAt), 'dd MMM yyyy, HH:mm')}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900 group-hover:text-black text-sm">{format(new Date(t.date), 'dd MMM yy')}</td>
                    <td className="px-4 py-3 text-gray-900 group-hover:text-black font-medium text-sm">{t.itemName}</td>
                    <td className="px-4 py-3 text-gray-600 group-hover:text-black text-right text-sm">{t.weight}</td>
                    <td className="px-4 py-3 text-gray-600 group-hover:text-black text-right text-sm">{t.touch || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 group-hover:text-black text-right text-sm">{t.wastage || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 group-hover:text-black text-right text-sm">{t.pure || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 group-hover:text-black text-right text-sm">{t.makerCharge ? `₹${t.makerCharge}` : '-'}</td>
                    <td className="px-4 py-3 text-gray-600 group-hover:text-black text-right text-sm">{t.G || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 group-hover:text-black text-right text-sm">
                      {t.finalPrice ? (
                        <div className="flex flex-col items-end">
                          <span>₹{t.finalPrice.toFixed(2)}</span>
                          {t.gstEnabled && <span className="text-[10px] text-gray-400 leading-none mt-1">incl. 18% GST</span>}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 group-hover:text-black text-sm max-w-xs truncate" title={t.remark || ''}>{t.remark || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <TransactionActions id={t.id} returnTo={`/customers/${customer.id}`} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] w-full mx-auto space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4">
          <Link href="/customers" className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600 group-hover:text-black">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 group-hover:text-black">Customer Details</h1>
        </div>
      </div>

      {/* Customer Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between max-w-4xl gap-4 sm:gap-0">
        <div className="flex items-center space-x-4">
          {customer.photoUrl ? (
            <img src={customer.photoUrl} alt={customer.name} className="w-16 h-16 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl border border-blue-200">
              {customer.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-black">{customer.name}</h2>
            <div className="text-sm text-gray-500 group-hover:text-black mt-1 flex flex-wrap items-center gap-2">
              <span>{customer.mobile}</span>
              {customer.address && (
                <>
                  <span className="text-gray-300 hidden sm:inline">|</span>
                  <span>{customer.address}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <Link href={`/customers/${customer.id}/edit`} className="flex items-center px-4 py-2 bg-gray-100 text-[#111] text-[12px] font-bold rounded-lg hover:bg-gray-200 transition-colors">
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Link>
      </div>

      <div className="flex justify-end mb-4">
        <Link 
          href={`/customers/${customer.id}?sort=${sort === 'ASC' ? 'desc' : 'asc'}`} 
          className="flex items-center px-5 py-3 bg-white border border-gray-100 shadow-sm text-[#111] rounded-full hover:bg-gray-50 text-[13px] font-bold transition-colors"
        >
          {sort === 'ASC' ? 'Oldest First (Click for Newest)' : 'Newest First (Click for Oldest)'}
        </Link>
      </div>
      {/* Split Screen Transactions Section */}
      <div className="pt-6 grid grid-cols-1 xl:grid-cols-2 gap-8">
        {renderTable('Purchases', purchases, 'PURCHASE')}
        {renderTable('Sales', sales, 'SALE')}
      </div>
    </div>
  );
}
