const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx', 'utf8');

content = content.replace(
  'className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"',
  'className="flex items-center px-4 py-2 bg-gray-100 text-[#111] text-[12px] font-bold rounded-lg hover:bg-gray-200 transition-colors"'
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx', content, 'utf8');
