const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/dashboard/page.tsx', 'utf8');

// 1. KPI Card Total Revenue Red Color
content = content.replace(
  '<h3 className="text-[28px] font-black text-[#111] leading-none">₹{totalRevenue.toLocaleString(\'en-IN\')}</h3>',
  '<h3 className={`text-[28px] font-black leading-none ${totalRevenue < 0 ? \'text-red-500\' : \'text-[#111]\'}`}>₹{totalRevenue.toLocaleString(\'en-IN\')}</h3>'
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/dashboard/page.tsx', content, 'utf8');
