const fs = require('fs');

// 1. WhatsApp Button
let receiptsContent = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/ReceiptsTable.tsx', 'utf8');
receiptsContent = receiptsContent.replace(
  'className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium shadow-sm transition-colors"',
  'className="flex items-center px-5 py-2.5 bg-[#111] text-white text-[13px] font-bold rounded-xl hover:bg-black transition-colors shadow-lg shadow-black/10"'
);
fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/ReceiptsTable.tsx', receiptsContent, 'utf8');

// 2. Add Transaction
let txContent = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/page.tsx', 'utf8');
txContent = txContent.replace(
  'className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors"',
  'className="flex items-center px-5 py-2.5 bg-[#111] text-white text-[13px] font-bold rounded-xl hover:bg-black transition-colors shadow-lg shadow-black/10"'
);
fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/page.tsx', txContent, 'utf8');

// 3. Add Customer
let custContent = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/page.tsx', 'utf8');
custContent = custContent.replace(
  'className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"',
  'className="flex items-center px-5 py-2.5 bg-[#111] text-white text-[13px] font-bold rounded-xl hover:bg-black transition-colors shadow-lg shadow-black/10"'
);
fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/page.tsx', custContent, 'utf8');

// 4. Sort Button in Customer detail page
let custDetailContent = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx', 'utf8');
custDetailContent = custDetailContent.replace(
  'className="flex items-center px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"',
  'className="flex items-center px-5 py-3 bg-white border border-gray-100 shadow-sm text-[#111] rounded-full hover:bg-gray-50 text-[13px] font-bold transition-colors"'
);
fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx', custDetailContent, 'utf8');
