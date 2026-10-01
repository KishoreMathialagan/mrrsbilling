import { query as dbQuery } from '@/lib/db';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import TransactionActions from '@/components/TransactionActions';
import { format } from 'date-fns';
import FilterBar from '@/components/FilterBar';

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; search?: string; startDate?: string; endDate?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const currentTab = params.tab === 'PURCHASE' ? 'PURCHASE' : 'SALE';
  const search = params.search || '';
  const startDate = params.startDate || '';
  const endDate = params.endDate || '';
  const sort = params.sort === 'asc' ? 'ASC' : 'DESC';

  let queryStr = `
    SELECT t.*, row_to_json(c.*) as customer 
    FROM "Transaction" t 
    LEFT JOIN "Customer" c ON t."customerId" = c.id 
    WHERE t.type = $1
  `;
  const queryParams: any[] = [currentTab];
  let paramCount = 2;

  if (search) {
    queryStr += ` AND (c.name ILIKE $${paramCount} OR c.mobile ILIKE $${paramCount} OR t."itemName" ILIKE $${paramCount})`;
    queryParams.push(`%${search}%`);
    paramCount++;
  }

  if (startDate) {
    queryStr += ` AND t.date >= $${paramCount}`;
    queryParams.push(`${startDate} 00:00:00`);
    paramCount++;
  }

  if (endDate) {
    queryStr += ` AND t.date <= $${paramCount}`;
    queryParams.push(`${endDate} 23:59:59`);
    paramCount++;
  }

  queryStr += ` ORDER BY t.date ${sort}, t."createdAt" ${sort}`;

  const transactionsRes = await dbQuery(queryStr, queryParams);
  const transactions = transactionsRes.rows;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-black">Purchase & Sales</h1>
        <Link href="/transactions/new" className="flex items-center px-5 py-2.5 bg-[#111] text-white text-[13px] font-bold rounded-xl hover:bg-black transition-colors shadow-lg shadow-black/10">
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </Link>
      </div>

      <div className="mb-4">
        <FilterBar defaultSearch={search} defaultStartDate={startDate} defaultEndDate={endDate}
      defaultSort={params.sort === 'asc' ? 'asc' : 'desc'} searchPlaceholder="Search by customer name, mobile, or item name..." />
      </div>

      {/* Segmented Control */}
      <div className="flex justify-start">
        <div className="flex bg-gray-200 p-1 rounded-lg w-fit shadow-inner">
          <Link 
            href="/transactions?tab=SALE" 
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${currentTab === 'SALE' ? 'bg-white text-gray-900 group-hover:text-black shadow-sm' : 'text-gray-500 group-hover:text-black hover:text-gray-700 hover:bg-gray-100'}`}
          >
            Sales
          </Link>
          <Link 
            href="/transactions?tab=PURCHASE" 
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${currentTab === 'PURCHASE' ? 'bg-white text-gray-900 group-hover:text-black shadow-sm' : 'text-gray-500 group-hover:text-black hover:text-gray-700 hover:bg-gray-100'}`}
          >
            Purchases
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto pb-10" >
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-600 group-hover:text-black w-16">S. No</th>
                <th className="px-4 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-600 group-hover:text-black">Date</th>
                <th className="px-4 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-600 group-hover:text-black">Customer</th>
                <th className="px-4 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-600 group-hover:text-black">Item</th>
                <th className="px-4 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-600 group-hover:text-black text-right">Weight (Kg)</th>
                <th className="px-4 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-600 group-hover:text-black text-right">Touch (%)</th>
                <th className="px-4 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-600 group-hover:text-black text-right">Wastage (%)</th>
                <th className="px-4 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-600 group-hover:text-black text-right">Pure</th>
                <th className="px-4 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-600 group-hover:text-black text-right">Maker Charge per Kg</th>
                <th className="px-4 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-600 group-hover:text-black text-right">Maker Charge</th>
                <th className="px-4 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-600 group-hover:text-black text-right">Final Price</th>
                <th className="px-4 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-600 group-hover:text-black">Remark</th>
                <th className="px-4 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-600 group-hover:text-black text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-12 text-center text-gray-500 group-hover:text-black">
                    No {currentTab.toLowerCase()} transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((t, index) => (
                  <tr key={t.id} className="hover:bg-gray-200 transition-colors text-black group relative">
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-gray-500 group-hover:text-black text-sm font-medium relative">
                      {index + 1}
                      <div className="absolute left-10 top-full mt-1 hidden group-hover:flex flex-col z-[100] bg-gray-300 text-black text-[11px] px-2 py-1.5 rounded shadow-sm whitespace-nowrap opacity-100">
                        <div>Created by: {t.createdBy || 'Admin'} at {format(new Date(t.createdAt), 'dd MMM yyyy, HH:mm')}</div>
                        <div>Updated by: {t.updatedBy || 'Admin'} at {format(new Date(t.updatedAt), 'dd MMM yyyy, HH:mm')}</div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-gray-900 group-hover:text-black font-medium">{format(new Date(t.date), 'dd MMM yyyy')}</td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-gray-600 group-hover:text-black">{t.customer?.name || '-'}</td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-gray-900 group-hover:text-black font-medium">{t.itemName}</td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-gray-600 group-hover:text-black text-right">{t.weight}</td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-gray-600 group-hover:text-black text-right">{t.touch || '-'}</td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-gray-600 group-hover:text-black text-right">{t.wastage || '-'}</td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-gray-600 group-hover:text-black text-right">{t.pure || '-'}</td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-gray-600 group-hover:text-black text-right">{t.makerCharge ? `₹${t.makerCharge}` : '-'}</td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-gray-600 group-hover:text-black text-right">{t.G || '-'}</td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-gray-600 group-hover:text-black text-right">
                      {t.finalPrice ? (
                        <div className="flex flex-col items-end">
                          <span>₹{t.finalPrice.toFixed(2)}</span>
                          {t.gstEnabled && <span className="text-[10px] text-gray-400 leading-none mt-1">incl. 18% GST</span>}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-gray-600 group-hover:text-black text-sm max-w-xs truncate" title={t.remark || ''}>{t.remark || '-'}</td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-right">
                      <TransactionActions id={t.id} />
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
}
