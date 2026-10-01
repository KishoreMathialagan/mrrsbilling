const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx', 'utf8');

content = content.replace(
  'className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"',
  'className="flex items-center px-4 py-2 bg-[#111] text-white text-[12px] font-bold rounded-lg hover:bg-black transition-colors shadow-lg shadow-black/10"'
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx', content, 'utf8');
