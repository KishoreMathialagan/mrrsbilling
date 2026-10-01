const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/dashboard/page.tsx', 'utf8');

content = content.replace(
  'const recentTxRes = await dbQuery(`',
  `const receiptsRes = await dbQuery('SELECT r.id, r."receiptNumber", r."totalAmount", r."customerId", (SELECT type FROM "Transaction" WHERE "receiptId" = r.id LIMIT 1) as type FROM "Receipt" r ORDER BY r."createdAt" DESC');\n  const recentTxRes = await dbQuery(\``
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/dashboard/page.tsx', content, 'utf8');
