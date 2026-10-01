const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/page.tsx', 'utf8');

// Update searchParams
content = content.replace(
  "searchParams: Promise<{ search?: string; startDate?: string; endDate?: string }>",
  "searchParams: Promise<{ search?: string; startDate?: string; endDate?: string; sort?: string }>"
);

content = content.replace(
  "const endDate = params.endDate || '';",
  "const endDate = params.endDate || '';\n  const sort = params.sort === 'asc' ? 'ASC' : 'DESC';"
);

// Update ORDER BY query
content = content.replace(
  "queryStr += ' ORDER BY \"createdAt\" DESC';",
  "queryStr += ` ORDER BY \"createdAt\" ${sort}`;"
);

// Update FilterBar props
content = content.replace(
  "<FilterBar defaultSearch={search} defaultStartDate={startDate} defaultEndDate={endDate} searchPlaceholder=\"Search by name, mobile...\" />",
  "<FilterBar defaultSearch={search} defaultStartDate={startDate} defaultEndDate={endDate} defaultSort={params.sort === 'asc' ? 'asc' : 'desc'} searchPlaceholder=\"Search by name, mobile...\" />"
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/page.tsx', content, 'utf8');
