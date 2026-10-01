import { query as dbQuery } from '@/lib/db';
import Link from 'next/link';
import { Plus, Edit2, Phone, MapPin, Eye } from 'lucide-react';
import DeleteButton from '@/components/DeleteButton';
import FilterBar from '@/components/FilterBar';
import { deleteCustomer } from './actions';

export default async function CustomersPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; startDate?: string; endDate?: string; sort?: string }>
}) {
  const params = await searchParams;
  const search = params.search || '';
  const startDate = params.startDate || '';
  const endDate = params.endDate || '';
  const sort = params.sort === 'asc' ? 'ASC' : 'DESC';
  let queryStr = 'SELECT * FROM "Customer" WHERE 1=1';
  const queryParams: any[] = [];
  let paramCount = 1;

  if (search) {
    queryStr += ` AND (name ILIKE $${paramCount} OR mobile ILIKE $${paramCount})`;
    queryParams.push(`%${search}%`);
    paramCount++;
  }

  if (startDate) {
    queryStr += ` AND "createdAt" >= $${paramCount}`;
    queryParams.push(`${startDate} 00:00:00`);
    paramCount++;
  }

  if (endDate) {
    queryStr += ` AND "createdAt" <= $${paramCount}`;
    queryParams.push(`${endDate} 23:59:59`);
    paramCount++;
  }

  queryStr += ` ORDER BY "createdAt" ${sort}`;

  const customersRes = await dbQuery(queryStr, queryParams);
  const customers = customersRes.rows;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <Link href="/customers/new" className="flex items-center px-5 py-2.5 bg-[#111] text-white text-[13px] font-bold rounded-xl hover:bg-black transition-colors shadow-lg shadow-black/10">
          <Plus className="w-5 h-5 mr-2" />
          Add Customer
        </Link>
      </div>

      <div className="mb-4">
        <FilterBar defaultSearch={search} defaultStartDate={startDate} defaultEndDate={endDate} defaultSort={params.sort === 'asc' ? 'asc' : 'desc'} searchPlaceholder="Search by name, mobile..." />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 w-24">Photo</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Mobile</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Address</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No customers found. Click "Add Customer" to create one.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {customer.photoUrl ? (
                        <img src={customer.photoUrl} alt={customer.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg border border-blue-200">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      <Link href={`/customers/${customer.id}`} className="hover:text-blue-600 transition-colors">
                        {customer.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.mobile}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate max-w-[200px]">{customer.address || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/customers/${customer.id}`} className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                        <Link href={`/customers/${customer.id}/edit`} className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                        <DeleteButton id={customer.id} action={deleteCustomer} />
                      </div>
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
