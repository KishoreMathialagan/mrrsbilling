const fs = require('fs');
const file = '/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const transactionCountRes = await dbQuery\('SELECT COUNT\(\*\) FROM "Transaction"'\);\n  const receiptCountRes = await dbQuery\('SELECT COUNT\(\*\) FROM "Receipt"'\);\n/,
  ''
);

content = content.replace(
  /const transactionCount = parseInt\(transactionCountRes.rows\[0\].count, 10\);\n  const receiptCount = parseInt\(receiptCountRes.rows\[0\].count, 10\);\n/,
  ''
);

const oldSalesQuery = `  // Fetch Sales Data for Line Chart (Day to Day)
  const salesRes = await dbQuery(\`
    SELECT DATE(date) as day, SUM("finalPrice") as total
    FROM "Transaction"
    WHERE type = 'SALE' AND date >= $1 AND date <= $2
    GROUP BY DATE(date)
    ORDER BY day ASC
  \`, [new Date(startDateStr + 'T00:00:00Z'), new Date(endDateStr + 'T23:59:59Z')]);
  
  const salesData = salesRes.rows.map((row: any) => ({
    day: new Date(row.day).toISOString().split('T')[0],
    total: parseFloat(row.total) || 0
  }));`;

const newSalesQuery = `  // Fetch Summary Data for Pie Chart and KPI Cards
  const summaryRes = await dbQuery(\`
    SELECT type, SUM("finalPrice") as total
    FROM "Transaction"
    WHERE date >= $1 AND date <= $2
    GROUP BY type
  \`, [new Date(startDateStr + 'T00:00:00Z'), new Date(endDateStr + 'T23:59:59Z')]);
  
  let totalSales = 0;
  let totalPurchase = 0;
  summaryRes.rows.forEach((row: any) => {
    if (row.type === 'SALE') totalSales = parseFloat(row.total) || 0;
    if (row.type === 'PURCHASE') totalPurchase = parseFloat(row.total) || 0;
  });
  const totalRevenue = totalSales - totalPurchase;
  
  const pieData = { sales: totalSales, purchase: totalPurchase };`;

content = content.replace(oldSalesQuery, newSalesQuery);

const oldCards = `          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer">
              <div>
                <p className="text-xs font-bold text-gray-400 mb-1 tracking-wide uppercase">Total Customers</p>
                <h3 className="text-[32px] font-black text-[#111] leading-none">{customerCount}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer">
              <div>
                <p className="text-xs font-bold text-gray-400 mb-1 tracking-wide uppercase">Transactions</p>
                <h3 className="text-[32px] font-black text-[#111] leading-none">{transactionCount}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#FFF9E6] text-[#FFBC11] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer">
              <div>
                <p className="text-xs font-bold text-gray-400 mb-1 tracking-wide uppercase">Receipts</p>
                <h3 className="text-[32px] font-black text-[#111] leading-none">{receiptCount}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
            </div>
          </div>`;

const newCards = `          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer">
              <div>
                <p className="text-xs font-bold text-gray-400 mb-1 tracking-wide uppercase">Total Customers</p>
                <h3 className="text-[32px] font-black text-[#111] leading-none">{customerCount}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer">
              <div>
                <p className="text-xs font-bold text-gray-400 mb-1 tracking-wide uppercase">Total Sales</p>
                <h3 className="text-[28px] font-black text-[#111] leading-none">₹{totalSales.toLocaleString('en-IN')}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer">
              <div>
                <p className="text-xs font-bold text-gray-400 mb-1 tracking-wide uppercase">Total Purchase</p>
                <h3 className="text-[28px] font-black text-[#111] leading-none">₹{totalPurchase.toLocaleString('en-IN')}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer">
              <div>
                <p className="text-xs font-bold text-gray-400 mb-1 tracking-wide uppercase">Total Revenue</p>
                <h3 className="text-[28px] font-black text-[#111] leading-none">₹{totalRevenue.toLocaleString('en-IN')}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#FFF9E6] text-[#FFBC11] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
            </div>
          </div>`;

content = content.replace(oldCards, newCards);

content = content.replace(/salesData=\{salesData\}/, 'pieData={pieData}');

fs.writeFileSync(file, content, 'utf8');
