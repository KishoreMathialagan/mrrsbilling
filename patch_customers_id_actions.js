const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx', 'utf8');

content = content.replace(
  /<TransactionActions id=\{t\.id\} \/>/g,
  '<TransactionActions id={t.id} returnTo={`/customers/${customer.id}`} />'
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx', content, 'utf8');
