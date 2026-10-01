const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/dashboard/page.tsx', 'utf8');

const injection = `
  const receiptsRes = await dbQuery(\`
    SELECT r.id, r."receiptNumber", r."totalAmount", r."customerId",
      (SELECT type FROM "Transaction" WHERE "receiptId" = r.id LIMIT 1) as type
    FROM "Receipt" r
    ORDER BY r."createdAt" DESC
  \`);
`;

content = content.replace(
  '  return (\n    <div className="flex-1 flex flex-col w-full">',
  injection + '\n  return (\n    <div className="flex-1 flex flex-col w-full">'
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/dashboard/page.tsx', content, 'utf8');
