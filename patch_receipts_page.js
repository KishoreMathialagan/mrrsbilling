const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/page.tsx', 'utf8');

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
  "queryStr += ` ORDER BY r.date DESC`;",
  "queryStr += ` ORDER BY r.date ${sort}, r.\"createdAt\" ${sort}`;"
);

// Update ReceiptsTable props
content = content.replace(
  "defaultEndDate={endDate}",
  "defaultEndDate={endDate}\n      defaultSort={params.sort === 'asc' ? 'asc' : 'desc'}"
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/page.tsx', content, 'utf8');
