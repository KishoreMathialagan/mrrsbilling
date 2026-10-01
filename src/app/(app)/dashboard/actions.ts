'use server';

import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function addPendingPayment(formData: FormData) {
  const customerId = formData.get('customerId') as string;
  const type = formData.get('type') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const reference = formData.get('reference') as string;
  const dueDateStr = formData.get('dueDate') as string;

  if (!customerId || !type || !amount || !dueDateStr) {
    throw new Error('Missing required fields');
  }

  const dueDate = new Date(dueDateStr);
  const id = crypto.randomUUID();

  await query(
    `INSERT INTO "PendingPayment" (id, "customerId", type, amount, reference, "dueDate", status, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [id, customerId, type, amount, reference, dueDate]
  );

  revalidatePath('/dashboard');
}

export async function markPendingPaymentCompleted(id: string) {
  await query(
    `UPDATE "PendingPayment" SET status = 'COMPLETED', "updatedAt" = CURRENT_TIMESTAMP WHERE id = $1`,
    [id]
  );
  revalidatePath('/dashboard');
}
