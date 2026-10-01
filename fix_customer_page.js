const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx', 'utf8');

content = content.replace(
  `export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {`,
  `export default async function CustomerDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {`
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx', content, 'utf8');
