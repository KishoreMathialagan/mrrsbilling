const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/page.tsx', 'utf8');

// I already patched searchParams, sort, and queryStr in patch_transactions_page.js!
// Let me just check if defaultSort is correctly passed to FilterBar
if (!content.includes('defaultSort={params.sort === \'asc\' ? \'asc\' : \'desc\'}')) {
  content = content.replace(
    "<FilterBar defaultSearch={search} defaultStartDate={startDate} defaultEndDate={endDate}",
    "<FilterBar defaultSearch={search} defaultStartDate={startDate} defaultEndDate={endDate} defaultSort={sort === 'ASC' ? 'asc' : 'desc'}"
  );
}

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/page.tsx', content, 'utf8');
