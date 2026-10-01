const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/ReceiptsTable.tsx', 'utf8');

// Add imports
content = content.replace(
  "import { Printer, MessageCircle } from 'lucide-react';",
  "import { Printer, MessageCircle, Edit, Trash2 } from 'lucide-react';\nimport { deleteReceipt } from './actions';\nimport { useTransition } from 'react';"
);

// Add useTransition to component body
content = content.replace(
  "const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);",
  "const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);\n  const [isPending, startTransition] = useTransition();\n\n  const handleDelete = (id: string) => {\n    if (confirm('Are you sure you want to delete this receipt?')) {\n      startTransition(async () => {\n        await deleteReceipt(id);\n      });\n    }\n  };"
);

// Update actions column in table header (widen it maybe)
content = content.replace(
  '<th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>',
  '<th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right min-w-[200px]">Actions</th>'
);

// Replace actions cell in table body
const actionsCell = `
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={\`/receipts/\${r.id}\`} className="inline-flex items-center px-2 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                          <Printer className="w-4 h-4 mr-1" />
                          Print
                        </Link>
                        <Link href={\`/receipts/\${r.id}/edit\`} className="inline-flex items-center px-2 py-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(r.id)} 
                          disabled={isPending}
                          className="inline-flex items-center px-2 py-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
`;
content = content.replace(
  /<td className="px-6 py-4 text-right">[\s\S]*?<\/td>/g,
  actionsCell
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/ReceiptsTable.tsx', content, 'utf8');
