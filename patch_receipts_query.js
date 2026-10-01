const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/page.tsx', 'utf8');

content = content.replace(
  'SELECT r.*, row_to_json(c.*) as customer, (SELECT count(*) FROM "Transaction" t WHERE t."receiptId" = r.id) as "_count_transactions"',
  'SELECT r.*, row_to_json(c.*) as customer, (SELECT count(*) FROM "Transaction" t WHERE t."receiptId" = r.id) as "_count_transactions", (SELECT string_agg("itemName", \', \') FROM "Transaction" t WHERE t."receiptId" = r.id) as "itemNames"'
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/page.tsx', content, 'utf8');
