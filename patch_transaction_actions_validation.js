const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/actions.ts', 'utf8');

// Insert validation in saveTransaction
content = content.replace(
  "  const itemName = formData.get('itemName') as string;",
  "  const itemName = formData.get('itemName') as string;\n  if (!itemName || itemName.trim() === '') {\n    // If there is no item, don't create transaction and receipt\n    const returnTo = formData.get('returnTo') as string || '/transactions';\n    redirect(returnTo);\n  }"
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/actions.ts', content, 'utf8');
