const fs = require('fs');
const file = '/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Modify renderTable definition
content = content.replace(
  'const renderTable = (title: string, data: any[]) => (',
  'const renderTable = (title: string, data: any[], type: string) => ('
);

// Modify the header
const oldHeader = '<h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>';
const newHeader = `<div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <Link 
          href={\`/transactions/new?customerId=\${customer.id}&type=\${type}\`} 
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
        >
          <span className="mr-1">+</span> Add more
        </Link>
      </div>`;
content = content.replace(oldHeader, newHeader);

// Update calls to renderTable
content = content.replace(
  "{renderTable('Purchases', purchases)}",
  "{renderTable('Purchases', purchases, 'PURCHASE')}"
);
content = content.replace(
  "{renderTable('Sales', sales)}",
  "{renderTable('Sales', sales, 'SALE')}"
);

fs.writeFileSync(file, content, 'utf8');
