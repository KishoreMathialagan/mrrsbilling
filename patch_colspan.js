const fs = require('fs');
const file = '/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<td colSpan={12}',
  '<td colSpan={13}'
);

fs.writeFileSync(file, content, 'utf8');
