const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/actions.ts', 'utf8');

// Replace redirect('/transactions') with redirect(returnTo) in saveTransaction
content = content.replace(
  "  revalidatePath('/receipts');\n  redirect('/transactions');\n}",
  "  revalidatePath('/receipts');\n  const returnTo = formData.get('returnTo') as string || '/transactions';\n  redirect(returnTo);\n}"
);

// Replace redirect('/transactions') with redirect(returnTo) in updateTransaction
content = content.replace(
  "  revalidatePath('/customers');\n  redirect('/transactions');\n}",
  "  revalidatePath('/customers');\n  const returnTo = formData.get('returnTo') as string || '/transactions';\n  redirect(returnTo);\n}"
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/actions.ts', content, 'utf8');
