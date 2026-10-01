const fs = require('fs');
const file = '/home/shaktimaan/Documents/mrrs_billing/src/components/DashboardAnalytics.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const radius = 50;/g,
  'const radius = 30; // 30 + (60/2) = 60'
);

content = content.replace(
  /strokeWidth="20"/g,
  'strokeWidth="60"'
);

fs.writeFileSync(file, content, 'utf8');
