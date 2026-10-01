'use server';

import { query as dbQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function addAdmin(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  // Check if username exists
  const existingRes = await dbQuery('SELECT id FROM "Admin" WHERE username = $1', [username]);
  if (existingRes.rows.length > 0) {
    return { error: 'Username already exists' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = Date.now().toString(); // simple ID generation
  const now = new Date().toISOString();

  try {
    await dbQuery(
      'INSERT INTO "Admin" (id, username, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5)',
      [id, username, hashedPassword, now, now]
    );
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const now = new Date().toISOString();

  if (!username) {
    return { error: 'Username is required' };
  }

  // Check if username is taken by another admin
  const existingRes = await dbQuery('SELECT id FROM "Admin" WHERE username = $1 AND id != $2', [username, session.adminId]);
  if (existingRes.rows.length > 0) {
    return { error: 'Username already taken by another admin' };
  }

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await dbQuery(
        'UPDATE "Admin" SET username = $1, password = $2, "updatedAt" = $3 WHERE id = $4',
        [username, hashedPassword, now, session.adminId]
      );
    } else {
      await dbQuery(
        'UPDATE "Admin" SET username = $1, "updatedAt" = $2 WHERE id = $3',
        [username, now, session.adminId]
      );
    }
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteAdmin(id: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  
  if (session.adminId === id) {
    return { error: 'Cannot delete your own account' };
  }

  try {
    await dbQuery('DELETE FROM "Admin" WHERE id = $1', [id]);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateSettings(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const gstRate = parseFloat(formData.get('gstRate') as string);
  
  if (isNaN(gstRate)) {
    return { error: 'Invalid GST rate' };
  }

  try {
    await dbQuery(
      'UPDATE "Settings" SET "gstRate" = $1, "updatedAt" = $2 WHERE id = $3',
      [gstRate, new Date().toISOString(), 'default']
    );
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
