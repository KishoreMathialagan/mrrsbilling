const fs = require('fs');
const file = '/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/new/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Modify the page to take searchParams
content = content.replace(
  'export default async function NewTransactionPage() {',
  'export default async function NewTransactionPage({ searchParams }: { searchParams?: Promise<{ customerId?: string, type?: string }> }) {\n  const params = await searchParams;\n  const customerId = params?.customerId;\n  const type = params?.type;'
);

content = content.replace(
  '<TransactionForm customers={customers} saveAction={saveTransaction} />',
  '<TransactionForm customers={customers} saveAction={saveTransaction} defaultCustomerId={customerId} defaultType={type} />'
);

fs.writeFileSync(file, content, 'utf8');
