const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/page.tsx', 'utf8');

content = content.replace(
  "searchParams: Promise<{ tab?: string; search?: string; startDate?: string; endDate?: string }>;",
  "searchParams: Promise<{ tab?: string; search?: string; startDate?: string; endDate?: string; sort?: string }>;"
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/page.tsx', content, 'utf8');
