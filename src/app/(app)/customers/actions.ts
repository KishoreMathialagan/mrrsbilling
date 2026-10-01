'use server';

import { query as dbQuery } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function saveCustomer(formData: FormData) {
  const id = formData.get('id') as string | null;
  const name = formData.get('name') as string;
  const mobile = formData.get('mobile') as string;
  const address = formData.get('address') as string;
  
  
  if (!name || !mobile || !address) {
    throw new Error('All fields are compulsory.');
  }
  
  if (!/^\d{10}$/.test(mobile)) {
    throw new Error('Mobile number must be exactly 10 digits.');
  }

  let photoUrl = formData.get('existingPhotoUrl') as string | null;

  const photoFile = formData.get('photoFile') as File | null;
  const photoBase64 = formData.get('photoBase64') as string | null;

  // Handle File Upload
  if (photoFile && photoFile.size > 0) {
    const bytes = await photoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${photoFile.name.replace(/\s/g, '_')}`;
    const filepath = path.join(process.cwd(), 'public/uploads', filename);
    await writeFile(filepath, buffer);
    photoUrl = `/uploads/${filename}`;
  } 
  // Handle Webcam Base64
  else if (photoBase64 && photoBase64.startsWith('data:image')) {
    const matches = photoBase64.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
      const buffer = Buffer.from(matches[2], 'base64');
      const filename = `${Date.now()}-webcam.${extension}`;
      const filepath = path.join(process.cwd(), 'public/uploads', filename);
      await writeFile(filepath, buffer);
      photoUrl = `/uploads/${filename}`;
    }
  }

  
  if (!photoUrl) {
    throw new Error('Customer photo is compulsory.');
  }

  if (id) {
    await dbQuery(
      `UPDATE "Customer" SET name = $1, mobile = $2, address = $3, "photoUrl" = $4, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $5`,
      [name, mobile, address, photoUrl, id]
    );
  } else {
    const newId = crypto.randomUUID();
    await dbQuery(
      `INSERT INTO "Customer" (id, name, mobile, address, "photoUrl", "updatedAt") VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
      [newId, name, mobile, address, photoUrl]
    );
  }

  revalidatePath('/customers');
  redirect('/customers');
}

export async function deleteCustomer(id: string) {
  await dbQuery(`DELETE FROM "Customer" WHERE id = $1`, [id]);
  revalidatePath('/customers');
}

