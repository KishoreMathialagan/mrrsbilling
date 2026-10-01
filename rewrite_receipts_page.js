const fs = require('fs');

const content = `import { query as dbQuery } from '@/lib/db';
import ReceiptsTable from './ReceiptsTable';

export default async function ReceiptsPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string, startDate?: string, endDate?: string }>
}) {
  const params = await searchParams;
  const search = params.search || '';
  const startDate = params.startDate || '';
  const endDate = params.endDate || '';

  let queryStr = \`
    SELECT r.*, row_to_json(c.*) as customer, (SELECT count(*) FROM "Transaction" t WHERE t."receiptId" = r.id) as "_count_transactions"
    FROM "Receipt" r
    LEFT JOIN "Customer" c ON r."customerId" = c.id
    WHERE 1=1
  \`;
  const queryParams: any[] = [];
  let paramCount = 1;

  if (search) {
    queryStr += \` AND (r."receiptNumber" ILIKE $\${paramCount} OR c.name ILIKE $\${paramCount} OR c.mobile ILIKE $\${paramCount})\`;
    queryParams.push(\`%\${search}%\`);
    paramCount++;
  }

  if (startDate) {
    queryStr += \` AND r.date >= $\${paramCount}\`;
    queryParams.push(\`\${startDate} 00:00:00\`);
    paramCount++;
  }

  if (endDate) {
    queryStr += \` AND r.date <= $\${paramCount}\`;
    queryParams.push(\`\${endDate} 23:59:59\`);
    paramCount++;
  }

  queryStr += \` ORDER BY r.date DESC\`;

  const receiptsRes = await dbQuery(queryStr, queryParams);
  
  const receipts = receiptsRes.rows.map(r => ({
    ...r,
    _count: { transactions: parseInt(r._count_transactions, 10) }
  }));

  return (
    <ReceiptsTable 
      receipts={receipts} 
      defaultSearch={search} 
      defaultStartDate={startDate} 
      defaultEndDate={endDate} 
    />
  );
}
`;

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/page.tsx', content, 'utf8');
