const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/ReceiptsTable.tsx', 'utf8');

// Remove the edit Link
content = content.replace(
  /<Link href={`\/receipts\/\${r.id}\/edit`} className="inline-flex items-center px-2 py-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100">\s*<Edit className="w-4 h-4" \/>\s*<\/Link>/g,
  ""
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/ReceiptsTable.tsx', content, 'utf8');
