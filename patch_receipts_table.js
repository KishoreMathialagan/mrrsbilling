const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/ReceiptsTable.tsx', 'utf8');

// Replace {r._count.transactions} items
content = content.replace(
  '<td className="px-6 py-4 text-gray-600">{r._count.transactions} items</td>',
  '<td className="px-6 py-4 text-gray-600">\n                      {r.itemNames ? (\n                        <span className="block truncate max-w-xs" title={r.itemNames}>{r.itemNames}</span>\n                      ) : (\n                        <span>{r._count.transactions} items</span>\n                      )}\n                    </td>'
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/ReceiptsTable.tsx', content, 'utf8');
