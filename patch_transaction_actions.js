const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/TransactionActions.tsx', 'utf8');

content = content.replace(
  'export default function TransactionActions({ id }: { id: string }) {',
  'export default function TransactionActions({ id, returnTo = "/transactions" }: { id: string, returnTo?: string }) {'
);

content = content.replace(
  '<Link href={`/transactions/${id}/edit`} className="text-gray-400 hover:text-blue-600 transition-colors">',
  '<Link href={`/transactions/${id}/edit?returnTo=${encodeURIComponent(returnTo)}`} className="text-gray-400 hover:text-blue-600 transition-colors">'
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/TransactionActions.tsx', content, 'utf8');
