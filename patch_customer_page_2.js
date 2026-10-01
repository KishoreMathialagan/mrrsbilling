const fs = require('fs');
const file = '/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { ArrowLeft, Edit2 } from 'lucide-react';",
  "import { ArrowLeft, Edit2 } from 'lucide-react';\nimport TransactionActions from '@/components/TransactionActions';"
);

// Add the Actions column header
content = content.replace(
  '<th className="px-4 py-3 text-sm font-semibold text-gray-600">Remark</th>\n              </tr>',
  '<th className="px-4 py-3 text-sm font-semibold text-gray-600">Remark</th>\n                <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-right w-24">Actions</th>\n              </tr>'
);

// Add the colspan in empty state
content = content.replace(
  '<td colSpan={11}',
  '<td colSpan={12}'
);

// Add the Actions column cell and the title for tooltip
const oldTr = '<tr key={t.id} className="hover:bg-gray-50 transition-colors">';
const newTr = `<tr key={t.id} className="hover:bg-gray-50 transition-colors" title={\`Created by: \${t.createdBy || 'System Admin'} at \${format(new Date(t.createdAt), 'dd MMM yyyy, HH:mm')}\\nUpdated by: \${t.updatedBy || 'System Admin'} at \${format(new Date(t.updatedAt), 'dd MMM yyyy, HH:mm')}\`}>`;
content = content.replace(oldTr, newTr);

const oldTdRemark = '<td className="px-4 py-3 text-gray-600 text-sm max-w-xs truncate" title={t.remark || \'\'}>{t.remark || \'-\'}</td>\n                  </tr>';
const newTdRemark = '<td className="px-4 py-3 text-gray-600 text-sm max-w-xs truncate" title={t.remark || \'\'}>{t.remark || \'-\'}</td>\n                    <td className="px-4 py-3 text-right">\n                      <TransactionActions id={t.id} />\n                    </td>\n                  </tr>';
content = content.replace(oldTdRemark, newTdRemark);

fs.writeFileSync(file, content, 'utf8');
