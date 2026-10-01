const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/FilterBar.tsx', 'utf8');

// Add ArrowUpDown import
if (!content.includes('ArrowDownWideNarrow')) {
  content = content.replace(
    "import { Search } from 'lucide-react';",
    "import { Search, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';"
  );
}

// Add defaultSort prop
content = content.replace(
  "defaultEndDate = '',",
  "defaultEndDate = '',\n  defaultSort = 'desc',"
);
content = content.replace(
  "defaultEndDate?: string;",
  "defaultEndDate?: string;\n  defaultSort?: string;"
);

// Add state for sort
content = content.replace(
  "const [endDate, setEndDate] = useState(defaultEndDate);",
  "const [endDate, setEndDate] = useState(defaultEndDate);\n  const [sortOrder, setSortOrder] = useState(defaultSort);"
);

// Update handleFilter to include sort
content = content.replace(
  "if (endDate) params.set('endDate', endDate); else params.delete('endDate');",
  "if (endDate) params.set('endDate', endDate); else params.delete('endDate');\n    params.set('sort', sortOrder);"
);

// Add the sort button UI
content = content.replace(
  '<button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium transition-colors">\n          Apply\n        </button>',
  `<button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium transition-colors">
          Apply
        </button>
        <button 
          type="button" 
          onClick={() => {
            const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
            setSortOrder(newOrder);
            const params = new URLSearchParams(searchParams.toString());
            if (search) params.set('search', search); else params.delete('search');
            if (startDate) params.set('startDate', startDate); else params.delete('startDate');
            if (endDate) params.set('endDate', endDate); else params.delete('endDate');
            params.set('sort', newOrder);
            router.push(\`\${pathname}?\${params.toString()}\`);
          }}
          className="flex items-center px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
        >
          {sortOrder === 'desc' ? <ArrowDownWideNarrow className="w-4 h-4 mr-2"/> : <ArrowUpNarrowWide className="w-4 h-4 mr-2"/>}
          {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
        </button>`
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/FilterBar.tsx', content, 'utf8');
