const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/ReceiptsTable.tsx', 'utf8');

// replace form
content = content.replace(
  /<form onSubmit=\{handleFilter\}[\s\S]*?<\/form>/,
  '<FilterBar defaultSearch={defaultSearch} defaultStartDate={defaultStartDate} defaultEndDate={defaultEndDate} searchPlaceholder="Search by receipt number, customer name, mobile..." />'
);

// import FilterBar
content = content.replace(
  "import { useRouter, usePathname, useSearchParams } from 'next/navigation';",
  "import FilterBar from '@/components/FilterBar';"
);

// remove the hooks and handleFilter
content = content.replace(
  /const router = useRouter\(\);[\s\S]*?router\.push\(`\$\{pathname\}\?\$\{params\.toString\(\)\}`\);\n  \};\n/g,
  ''
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/ReceiptsTable.tsx', content, 'utf8');
