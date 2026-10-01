const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx', 'utf8');

content = content.replace(
  "export default async function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {",
  `export default async function CustomerDetailsPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ sort?: string }>
}) {`
);

content = content.replace(
  "const { id } = await params;",
  "const { id } = await params;\n  const sParams = await searchParams;\n  const sort = sParams.sort === 'asc' ? 'ASC' : 'DESC';"
);

content = content.replace(
  "const transactionsRes = await dbQuery('SELECT * FROM \"Transaction\" WHERE \"customerId\" = $1 ORDER BY date DESC', [id]);",
  "const transactionsRes = await dbQuery(`SELECT * FROM \"Transaction\" WHERE \"customerId\" = $1 ORDER BY date ${sort}, \"createdAt\" ${sort}`, [id]);"
);

// We need to inject the sort button above the tables
// Inside the return block, before the split screen transactions section
// Or add FilterBar!
if (!content.includes('import FilterBar')) {
  content = content.replace(
    "import DeleteButton from '@/components/DeleteButton';",
    "import DeleteButton from '@/components/DeleteButton';\nimport FilterBar from '@/components/FilterBar';"
  );
}

// Add the Sort button just above the tables grid
content = content.replace(
  "{/* Split Screen Transactions Section */}",
  `<div className="flex justify-end mb-4">
        <Link 
          href={\`/customers/\${customer.id}?sort=\${sort === 'ASC' ? 'desc' : 'asc'}\`} 
          className="flex items-center px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
        >
          {sort === 'ASC' ? 'Oldest First (Click for Newest)' : 'Newest First (Click for Oldest)'}
        </Link>
      </div>
      {/* Split Screen Transactions Section */}`
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx', content, 'utf8');
