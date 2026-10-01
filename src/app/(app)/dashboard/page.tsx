import { query as dbQuery } from '@/lib/db';
import { Plus, IndianRupee, Users } from 'lucide-react';
import DashboardSearch from '@/components/DashboardSearch';
import DashboardAnalytics from '@/components/DashboardAnalytics';
import DashboardBarChart from '@/components/DashboardBarChart';
import ActionRequiredCard from '@/components/ActionRequiredCard';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage(props: { searchParams?: Promise<{ q?: string, startDate?: string, endDate?: string, year?: string }> }) {
  const session = await getSession();
  if (!session) redirect('/login');
  
  const customerCountRes = await dbQuery('SELECT COUNT(*) FROM "Customer"');
  const customersTodayRes = await dbQuery('SELECT COUNT(*) FROM "Customer" WHERE DATE("createdAt") = CURRENT_DATE');

  const customerCount = parseInt(customerCountRes.rows[0].count, 10);
  const customersTodayCount = parseInt(customersTodayRes.rows[0].count, 10);

  const searchParams = await props.searchParams;
  const q = searchParams?.q || '';

  // Default to last 30 days for Line Chart
  const today = new Date();
  const defaultEndDateStr = today.toISOString().split('T')[0];
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const defaultStartDateStr = thirtyDaysAgo.toISOString().split('T')[0];

  const startDateStr = searchParams?.startDate || defaultStartDateStr;
  const endDateStr = searchParams?.endDate || defaultEndDateStr;

  // Selected Year for Bar Chart
  const selectedYear = searchParams?.year || today.getFullYear().toString();

  // Fetch Summary Data for Pie Chart and KPI Cards
  const summaryRes = await dbQuery(`
    SELECT type, SUM("finalPrice") as total
    FROM "Transaction"
    WHERE date >= $1 AND date <= $2
    GROUP BY type
  `, [new Date(startDateStr + 'T00:00:00Z'), new Date(endDateStr + 'T23:59:59Z')]);

  let totalSales = 0;
  let totalPurchase = 0;
  summaryRes.rows.forEach((row: any) => {
    if (row.type === 'SALE') totalSales = parseFloat(row.total) || 0;
    if (row.type === 'PURCHASE') totalPurchase = parseFloat(row.total) || 0;
  });
  const totalRevenue = totalSales - totalPurchase;

  const pieData = { sales: totalSales, purchase: totalPurchase };

  // Fetch Monthly Data for Bar Chart
  // SQLite/Postgres? We are using Postgres (`ILIKE`, `row_to_json`)
  const monthlyRes = await dbQuery(`
    SELECT to_char(date, 'MM') as month, 
           SUM(CASE WHEN type = 'SALE' THEN "finalPrice" ELSE 0 END) - 
           SUM(CASE WHEN type = 'PURCHASE' THEN "finalPrice" ELSE 0 END) as total
    FROM "Transaction"
    WHERE extract(year from date) = $1
    GROUP BY to_char(date, 'MM')
  `, [parseInt(selectedYear, 10)]);

  const monthlyData = monthlyRes.rows.map((row: any) => ({
    month: row.month,
    total: parseFloat(row.total) || 0
  }));

  let recentTransactions = [];
  if (q) {
    const res = await dbQuery(`
      SELECT t.*, row_to_json(c.*) as customer 
      FROM "Transaction" t 
      LEFT JOIN "Customer" c ON t."customerId" = c.id 
      WHERE t."itemName" ILIKE $1 OR t.type ILIKE $1 OR c.name ILIKE $1
      ORDER BY t."createdAt" DESC LIMIT 10
    `, [`%${q}%`]);
    recentTransactions = res.rows;
  } else {
    const res = await dbQuery(`
      SELECT t.*, row_to_json(c.*) as customer 
      FROM "Transaction" t 
      LEFT JOIN "Customer" c ON t."customerId" = c.id 
      ORDER BY t."createdAt" DESC LIMIT 10
    `);
    recentTransactions = res.rows;
  }

  const customersRes = await dbQuery('SELECT id, name FROM "Customer" ORDER BY name ASC');
  const pendingPaymentsRes = await dbQuery(`
    SELECT p.*, c.name as "customerName" 
    FROM "PendingPayment" p 
    JOIN "Customer" c ON p."customerId" = c.id 
    WHERE p.status = 'PENDING' 
    ORDER BY p."dueDate" ASC
  `);


  const receiptsRes = await dbQuery(`
    SELECT r.id, r."receiptNumber", r."totalAmount", r."customerId",
      (SELECT type FROM "Transaction" WHERE "receiptId" = r.id LIMIT 1) as type
    FROM "Receipt" r
    ORDER BY r."createdAt" DESC
  `);

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div>
          <h2 className="text-sm sm:text-[17px] text-gray-400 font-bold mb-1 tracking-wide">Hello, {session.username}!</h2>
          <h1 className="text-2xl sm:text-[32px] md:text-[40px] font-extrabold text-[#111] tracking-tight leading-[1.1]">
            You&apos;ve got<br className="hidden sm:block" />{customersTodayCount} customers today 📝
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <DashboardSearch />
          <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div className="text-right">
              <div className="font-extrabold text-[14px] text-[#111]">{session.username}</div>
              <div className="text-[11px] font-bold text-gray-400">Admin</div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-gray-500 text-sm sm:text-base uppercase">
              {session.username.substring(0, 2)}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex flex-col gap-6 sm:gap-8 w-full">

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="booking-card booking-card-blue bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer gap-2 sm:gap-0">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 mb-1 tracking-wide uppercase">Total Customers</p>
              <h3 className="text-xl sm:text-[32px] font-black text-[#111] leading-none">{customerCount}</h3>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="booking-card booking-card-green bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer gap-2 sm:gap-0">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 mb-1 tracking-wide uppercase">Total Sales</p>
              <h3 className="text-lg sm:text-[28px] font-black text-[#111] leading-none">₹{totalSales.toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="booking-card booking-card-red bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer gap-2 sm:gap-0">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 mb-1 tracking-wide uppercase">Total Purchase</p>
              <h3 className="text-lg sm:text-[28px] font-black text-[#111] leading-none">₹{totalPurchase.toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="booking-card booking-card-yellow bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer gap-2 sm:gap-0">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 mb-1 tracking-wide uppercase">Total Revenue</p>
              <h3 className={`text-lg sm:text-[28px] font-black leading-none ${totalRevenue < 0 ? 'text-red-500' : 'text-[#111]'}`}>₹{totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#FFF9E6] text-[#FFE375] flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        {/* Graph and Action Required Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <DashboardBarChart monthlyData={monthlyData} year={selectedYear} />

            <DashboardAnalytics
              pieData={pieData}
              defaultStart={defaultStartDateStr}
              defaultEnd={defaultEndDateStr}
            />
          </div>

          <ActionRequiredCard customers={customersRes.rows} pendingPayments={pendingPaymentsRes.rows} receipts={receiptsRes.rows} />
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-50 p-5 sm:p-6 lg:p-8 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <div>
              <h3 className="text-lg sm:text-[20px] font-extrabold text-[#111]">Recent Transactions</h3>
              <p className="text-xs sm:text-sm font-bold text-gray-400 mt-1">Purchases and Sales overview</p>
            </div>
            <button className="text-sm font-bold text-[#FFE375] hover:text-[#e5a810] transition-colors">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 text-[12px] uppercase tracking-wider text-gray-400 font-bold">
                  <th className="px-3 sm:px-4 pb-3 sm:pb-4 font-bold">Date</th>
                  <th className="px-3 sm:px-4 pb-3 sm:pb-4 font-bold">Type</th>
                  <th className="px-3 sm:px-4 pb-3 sm:pb-4 font-bold">Customer</th>
                  <th className="px-3 sm:px-4 pb-3 sm:pb-4 font-bold">Item</th>
                  <th className="px-3 sm:px-4 pb-3 sm:pb-4 text-right font-bold">Weight (Kg)</th>
                  <th className="px-3 sm:px-4 pb-3 sm:pb-4 text-right font-bold">Pure</th>
                </tr>
              </thead>
              <tbody className="text-[14px]">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                      <td className="px-3 sm:px-4 py-3 sm:py-4 font-bold text-gray-500">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${tx.type === 'SALE'
                            ? 'bg-green-50 text-green-600 border border-green-100'
                            : 'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 font-extrabold text-[#111]">
                        {tx.customer?.name || 'Unknown'}
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 font-bold text-gray-600">
                        {tx.itemName}
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 text-right font-bold text-[#111]">
                        {tx.weight}
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 text-right font-bold text-[#111]">
                        {tx.pure !== null ? tx.pure : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 font-bold">
                      No recent transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
