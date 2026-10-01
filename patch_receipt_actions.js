const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/actions.ts', 'utf8');

content += `
export async function updateReceipt(id: string, formData: FormData) {
  const customerId = formData.get('customerId') as string;
  const totalAmount = parseFloat(formData.get('totalAmount') as string) || 0;

  await dbQuery(
    \`UPDATE "Receipt" SET "customerId" = $1, "totalAmount" = $2, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $3\`,
    [customerId, totalAmount, id]
  );

  revalidatePath('/receipts');
  redirect('/receipts');
}

export async function deleteReceipt(id: string) {
  // This will set receiptId to null in Transaction due to ON DELETE SET NULL
  await dbQuery('DELETE FROM "Receipt" WHERE id = $1', [id]);
  revalidatePath('/receipts');
}
`;

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/actions.ts', content, 'utf8');
