const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/DashboardAnalytics.tsx', 'utf8');

content = content.replace(
  '<h3 className="text-[18px] sm:text-[20px] font-extrabold text-[#111]">Sales</h3>',
  '<h3 className="text-[18px] sm:text-[20px] font-extrabold text-[#111]">Sales & Purchase</h3>'
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/DashboardAnalytics.tsx', content, 'utf8');
