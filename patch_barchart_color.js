const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/DashboardBarChart.tsx', 'utf8');

// Replace the text-[#111] with a conditional red for negative values in the label above the bar
content = content.replace(
  'className="absolute text-[#111] text-[9px] sm:text-[10px] font-bold pb-1 pointer-events-none whitespace-nowrap z-10 drop-shadow-md transition-all duration-300"',
  'className={`absolute text-[9px] sm:text-[10px] font-bold pb-1 pointer-events-none whitespace-nowrap z-10 drop-shadow-md transition-all duration-300 ${val < 0 ? \'text-red-500\' : \'text-[#111]\'}`}'
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/DashboardBarChart.tsx', content, 'utf8');
