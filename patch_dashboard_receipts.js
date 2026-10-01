const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/dashboard/page.tsx', 'utf8');

// Insert receiptsRes fetch
content = content.replace(
  "const pendingPaymentsRes = await dbQuery('SELECT p.*, c.name as \"customerName\" FROM \"PendingPayment\" p JOIN \"Customer\" c ON p.\"customerId\" = c.id WHERE p.status = \\'PENDING\\' ORDER BY p.\"dueDate\" ASC');",
  `const pendingPaymentsRes = await dbQuery('SELECT p.*, c.name as "customerName" FROM "PendingPayment" p JOIN "Customer" c ON p."customerId" = c.id WHERE p.status = \\'PENDING\\' ORDER BY p."dueDate" ASC');\n  const receiptsRes = await dbQuery(\`SELECT r.id, r."receiptNumber", r."totalAmount", r."customerId", (SELECT type FROM "Transaction" WHERE "receiptId" = r.id LIMIT 1) as type FROM "Receipt" r ORDER BY r."createdAt" DESC\`);`
);

// Pass receipts to ActionRequiredCard
content = content.replace(
  '<ActionRequiredCard customers={customersRes.rows} pendingPayments={pendingPaymentsRes.rows} />',
  '<ActionRequiredCard customers={customersRes.rows} pendingPayments={pendingPaymentsRes.rows} receipts={receiptsRes.rows} />'
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/dashboard/page.tsx', content, 'utf8');
