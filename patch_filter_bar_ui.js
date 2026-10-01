const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/FilterBar.tsx', 'utf8');

// Container
content = content.replace(
  'className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100"',
  'className="flex flex-col sm:flex-row gap-4 bg-white p-5 rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-50"'
);

// Search Icon
content = content.replace(
  '<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />',
  '<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />'
);

// Search Input
content = content.replace(
  'className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"',
  'className="w-full bg-white border border-gray-100 shadow-sm rounded-full py-3 pl-12 pr-4 text-[13px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFE375] transition-all placeholder:text-gray-400"'
);

// Date Inputs (there are two)
content = content.replaceAll(
  'className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"',
  'className="bg-white border border-gray-100 shadow-sm rounded-full px-4 py-3 text-[13px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFE375] transition-all"'
);

// Apply button
content = content.replace(
  'className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium transition-colors"',
  'className="px-6 py-3 bg-[#111] text-white rounded-full hover:bg-black text-[13px] font-bold shadow-lg shadow-black/10 transition-colors"'
);

// Sort button
content = content.replace(
  'className="flex items-center px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"',
  'className="flex items-center px-5 py-3 bg-white border border-gray-100 shadow-sm text-[#111] rounded-full hover:bg-gray-50 text-[13px] font-bold transition-colors"'
);

// Font update for "to"
content = content.replace(
  '<span className="text-gray-400 text-sm">to</span>',
  '<span className="text-gray-400 text-[13px] font-bold px-1">to</span>'
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/FilterBar.tsx', content, 'utf8');
