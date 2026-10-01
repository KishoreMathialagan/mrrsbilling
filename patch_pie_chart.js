const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/DashboardAnalytics.tsx', 'utf8');

// Change Purchase circle from red to blue
content = content.replace(
  'stroke="#ef4444" // red for purchase',
  'stroke="#3b82f6" // blue for purchase'
);
content = content.replace(
  'bg-red-500',
  'bg-blue-500'
);

// Change Sales circle from green to purple
content = content.replace(
  'stroke="#22c55e" // green for sales',
  'stroke="#a855f7" // purple for sales'
);
content = content.replace(
  'bg-green-500',
  'bg-purple-500'
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/DashboardAnalytics.tsx', content, 'utf8');
