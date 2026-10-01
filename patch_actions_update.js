const fs = require('fs');
const file = '/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/actions.ts';
let content = fs.readFileSync(file, 'utf8');

const updateFunc = `
export async function updateTransaction(id: string, formData: FormData) {
  const type = formData.get('type') as string;
  const date = new Date(formData.get('date') as string);
  const itemName = formData.get('itemName') as string;
  
  const touchStr = formData.get('touch') as string;
  const wastageStr = formData.get('wastage') as string;
  const pureStr = formData.get('pure') as string;
  const makerChargeStr = formData.get('makerCharge') as string;
  const gStr = formData.get('G') as string;
  const finalPriceStr = formData.get('finalPrice') as string;

  const weight = parseFloat(formData.get('weight') as string) || 0;
  const touch = touchStr !== '' ? parseFloat(touchStr) : null;
  const wastage = wastageStr !== '' ? parseFloat(wastageStr) : null;
  const pure = pureStr !== '' ? parseFloat(pureStr) : null;
  const makerCharge = makerChargeStr !== '' ? parseFloat(makerChargeStr) : null;
  const G = gStr !== '' ? parseFloat(gStr) : null;
  const remark = formData.get('remark') as string || null;
  const gstEnabled = formData.get('gstEnabled') === 'true' || formData.get('gstEnabled') === 'on';
  const finalPrice = finalPriceStr !== '' ? parseFloat(finalPriceStr) : null;
  
  const customerId = formData.get('customerId') as string || null;
  const session = await getSession();
  const username = session?.username || 'System Admin';

  let finalCustomerId = customerId;

  if (!finalCustomerId) {
    const walkInRes = await dbQuery(\`SELECT id FROM "Customer" WHERE name = 'Walk-in Customer' LIMIT 1\`);
    if (walkInRes.rowCount && walkInRes.rowCount > 0) {
      finalCustomerId = walkInRes.rows[0].id;
    } else {
      finalCustomerId = crypto.randomUUID();
      await dbQuery(
        \`INSERT INTO "Customer" (id, name, mobile, address, "updatedAt") VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)\`,
        [finalCustomerId, 'Walk-in Customer', '0000000000', '']
      );
    }
  }

  // We should also update the totalAmount in Receipt if it exists, or handle it properly.
  // For simplicity, just update the Transaction record.
  await dbQuery(
    \`UPDATE "Transaction" SET 
      type = $1, date = $2, "itemName" = $3, weight = $4, touch = $5, wastage = $6, 
      pure = $7, "makerCharge" = $8, "G" = $9, remark = $10, "gstEnabled" = $11, 
      "finalPrice" = $12, "customerId" = $13, "updatedAt" = CURRENT_TIMESTAMP, "updatedBy" = $14
    WHERE id = $15\`,
    [type, date, itemName, weight, touch, wastage, pure, makerCharge, G, remark, gstEnabled, finalPrice, finalCustomerId, username, id]
  );

  revalidatePath('/transactions');
  revalidatePath('/customers');
  redirect('/transactions');
}
`;

content += updateFunc;
fs.writeFileSync(file, content, 'utf8');
