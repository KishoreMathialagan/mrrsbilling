const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/[id]/edit/page.tsx', 'utf8');

content = content.replace(
  'export default async function EditTransactionPage({',
  `export default async function EditTransactionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const returnTo = sParams.returnTo || '/transactions';`
);

content = content.replace(
  `export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;`,
  ''
); // Wait, this replace might be problematic if not exact. Let's do a better replace.
