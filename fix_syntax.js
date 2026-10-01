const fs = require('fs');
['/home/shaktimaan/Documents/mrrs_billing/src/components/ActionRequiredCard.tsx', 
 '/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/dashboard/actions.ts'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\`/g, '`');
  fs.writeFileSync(file, content, 'utf8');
});
