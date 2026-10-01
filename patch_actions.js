const fs = require('fs');

const content = `'use server';

import { query as dbQuery } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';

export async function saveTransaction(formData: FormData) {
  const type = formData.get('type') as string;
  const date = new Date(formData.get('date') as string);
  
  const itemNames = formData.getAll('itemName[]') as string[];
  if (!itemNames || itemNames.length === 0 || !itemNames[0] || itemNames[0].trim() === '') {
    // If there is no item, don't create transaction and receipt
    const returnTo = formData.get('returnTo') as string || '/transactions';
    redirect(returnTo);
  }
  
  const weights = formData.getAll('weight[]') as string[];
  const touches = formData.getAll('touch[]') as string[];
  const wastages = formData.getAll('wastage[]') as string[];
  const pures = formData.getAll('pure[]') as string[];
  const makerCharges = formData.getAll('makerCharge[]') as string[];
  const gs = formData.getAll('G[]') as string[];
  const remarks = formData.getAll('remark[]') as string[];
  const finalPrices = formData.getAll('finalPrice[]') as string[];

  const gstEnabled = formData.get('gstEnabled') === 'true' || formData.get('gstEnabled') === 'on';
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

  const receiptId = crypto.randomUUID();
  const receiptNumber = \`RCPT-\${Date.now()}\`;
  
  let totalAmount = 0;
  for (let i = 0; i < finalPrices.length; i++) {
    totalAmount += (parseFloat(finalPrices[i]) || 0);
  }

  await dbQuery(
    \`INSERT INTO "Receipt" (id, "receiptNumber", "customerId", "totalAmount", "updatedAt") VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)\`,
    [receiptId, receiptNumber, finalCustomerId, totalAmount]
  );

  for (let i = 0; i < itemNames.length; i++) {
    const itemName = itemNames[i];
    if (!itemName || itemName.trim() === '') continue;

    const weight = parseFloat(weights[i]) || 0;
    const touch = touches[i] !== '' ? parseFloat(touches[i]) : null;
    const wastage = wastages[i] !== '' ? parseFloat(wastages[i]) : null;
    const pure = pures[i] !== '' ? parseFloat(pures[i]) : null;
    const makerCharge = makerCharges[i] !== '' ? parseFloat(makerCharges[i]) : null;
    const G = gs[i] !== '' ? parseFloat(gs[i]) : null;
    const remark = remarks[i] || null;
    const finalPrice = finalPrices[i] !== '' ? parseFloat(finalPrices[i]) : null;
    
    const transactionId = crypto.randomUUID();
    
    await dbQuery(
      \`INSERT INTO "Transaction" (id, type, date, "itemName", weight, touch, wastage, pure, "makerCharge", "G", remark, "gstEnabled", "finalPrice", "customerId", "receiptId", "updatedAt", "createdBy", "updatedBy") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP, $16, $16)\`,
      [transactionId, type, date, itemName, weight, touch, wastage, pure, makerCharge, G, remark, gstEnabled, finalPrice, finalCustomerId, receiptId, username]
    );
  }

  revalidatePath('/transactions');
  revalidatePath('/receipts');
  const returnTo = formData.get('returnTo') as string || '/transactions';
  redirect(returnTo);
}

export async function deleteTransaction(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  await dbQuery('DELETE FROM "Transaction" WHERE id = $1', [id]);
  revalidatePath('/transactions');
  revalidatePath('/customers');
}

export async function updateTransaction(id: string, formData: FormData) {
  const type = formData.get('type') as string;
  const date = new Date(formData.get('date') as string);
  
  const itemNames = formData.getAll('itemName[]') as string[];
  const itemName = itemNames[0];
  
  const weights = formData.getAll('weight[]') as string[];
  const touches = formData.getAll('touch[]') as string[];
  const wastages = formData.getAll('wastage[]') as string[];
  const pures = formData.getAll('pure[]') as string[];
  const makerCharges = formData.getAll('makerCharge[]') as string[];
  const gs = formData.getAll('G[]') as string[];
  const remarks = formData.getAll('remark[]') as string[];
  const finalPrices = formData.getAll('finalPrice[]') as string[];

  const weight = parseFloat(weights[0]) || 0;
  const touch = touches[0] !== '' ? parseFloat(touches[0]) : null;
  const wastage = wastages[0] !== '' ? parseFloat(wastages[0]) : null;
  const pure = pures[0] !== '' ? parseFloat(pures[0]) : null;
  const makerCharge = makerCharges[0] !== '' ? parseFloat(makerCharges[0]) : null;
  const G = gs[0] !== '' ? parseFloat(gs[0]) : null;
  const remark = remarks[0] || null;
  const finalPrice = finalPrices[0] !== '' ? parseFloat(finalPrices[0]) : null;

  const gstEnabled = formData.get('gstEnabled') === 'true' || formData.get('gstEnabled') === 'on';
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
  const returnTo = formData.get('returnTo') as string || '/transactions';
  redirect(returnTo);
}
`;

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/actions.ts', content, 'utf8');
