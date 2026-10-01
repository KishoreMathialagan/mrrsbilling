const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/page.tsx', 'utf8');

// Update searchParams
content = content.replace(
  "searchParams: Promise<{ search?: string, startDate?: string, endDate?: string }>",
  "searchParams: Promise<{ search?: string, startDate?: string, endDate?: string, sort?: string }>"
);

content = content.replace(
  "const endDate = params.endDate || '';",
  "const endDate = params.endDate || '';\n  const sort = params.sort === 'asc' ? 'ASC' : 'DESC';"
);

// Update ORDER BY query
content = content.replace(
  "queryStr += ` ORDER BY t.date DESC`;",
  "queryStr += ` ORDER BY t.date ${sort}, t.\"createdAt\" ${sort}`;"
);

// Update TransactionsTable props
content = content.replace(
  "defaultEndDate={endDate}",
  "defaultEndDate={endDate}\n      defaultSort={params.sort === 'asc' ? 'asc' : 'desc'}"
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/page.tsx', content, 'utf8');
