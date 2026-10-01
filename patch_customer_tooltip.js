const fs = require('fs');
const file = '/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /className="hover:bg-gray-50 transition-colors" title=\{`Created by: \$\{t\.createdBy \|\| 'System Admin'\} at \$\{format\(new Date\(t\.createdAt\), 'dd MMM yyyy, HH:mm'\)\}\\nUpdated by: \$\{t\.updatedBy \|\| 'System Admin'\} at \$\{format\(new Date\(t\.updatedAt\), 'dd MMM yyyy, HH:mm'\)\}`\}/g,
  'className="hover:bg-gray-200 transition-colors text-black group relative"'
);

const oldTd = '<td className="px-4 py-3 text-gray-500 text-sm font-medium">{index + 1}</td>';
const newTd = `<td className="px-4 py-3 text-gray-500 text-sm font-medium relative">
                      {index + 1}
                      <div className="absolute left-12 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col z-50 bg-gray-300 text-black text-[11px] px-2 py-1.5 rounded shadow-sm whitespace-nowrap opacity-100">
                        <div>Created by: {t.createdBy || 'System Admin'} at {format(new Date(t.createdAt), 'dd MMM yyyy, HH:mm')}</div>
                        <div>Updated by: {t.updatedBy || 'System Admin'} at {format(new Date(t.updatedAt), 'dd MMM yyyy, HH:mm')}</div>
                      </div>
                    </td>`;
content = content.replace(oldTd, newTd);
content = content.replace(oldTd, newTd); // since there are two tables? 
// Wait, renderTable is called with the data, the map is inside renderTable, so there's only one map for both tables!
// Let me verify this.

fs.writeFileSync(file, content, 'utf8');
