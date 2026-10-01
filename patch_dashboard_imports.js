const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/dashboard/page.tsx', 'utf8');

if (!content.includes('ActionRequiredCard')) {
  content = content.replace(
    "import DashboardBarChart from '@/components/DashboardBarChart';",
    "import DashboardBarChart from '@/components/DashboardBarChart';\nimport ActionRequiredCard from '@/components/ActionRequiredCard';"
  );
  
  // Before returning, fetch pending payments and customers
  content = content.replace(
    "const recentTxRes = await dbQuery(`",
    "const customersRes = await dbQuery('SELECT id, name FROM \"Customer\" ORDER BY name ASC');\n  const pendingPaymentsRes = await dbQuery('SELECT p.*, c.name as \"customerName\" FROM \"PendingPayment\" p JOIN \"Customer\" c ON p.\"customerId\" = c.id WHERE p.status = \\'PENDING\\' ORDER BY p.\"dueDate\" ASC');\n  const recentTxRes = await dbQuery(`"
  );
  
  // Replace the hardcoded Action Required Card HTML
  // We need to replace lines 167 to 226 roughly.
  const startTag = '<div className="bg-white rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-50 p-8 w-full">';
  const endTag = '</div>\n        </div>\n\n        {/* Recent Transactions Table */}';
  
  const startIndex = content.indexOf(startTag);
  if (startIndex !== -1) {
    let endIndex = content.indexOf('        {/* Recent Transactions Table */}');
    // find the closing div of grid-cols-1 lg:grid-cols-3
    // Wait, the grid contains two items: lg:col-span-2 (with chart + analytics) and the Action Required card.
    // So the end of Action Required card is before `</div>\n        </div>\n\n        {/* Recent`.
    
    // Let's use a simpler replace strategy:
    const regex = /<div className="bg-white rounded-3xl shadow-\[0_20px_40px_rgb\(0,0,0,0\.08\)\] border border-gray-50 p-8 w-full">\s*<div className="flex justify-between items-end mb-8">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Recent Transactions Table \*\/\}/m;
    
    content = content.replace(regex, `<ActionRequiredCard customers={customersRes.rows} pendingPayments={pendingPaymentsRes.rows} />\n        </div>\n\n        {/* Recent Transactions Table */}`);
  }
  
  fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/dashboard/page.tsx', content, 'utf8');
}
