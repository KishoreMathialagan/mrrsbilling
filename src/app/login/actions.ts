'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { query as dbQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';

export async function handleLogin(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    redirect('/login?error=Missing+credentials');
  }

  const adminRes = await dbQuery('SELECT * FROM "Admin" WHERE username = $1', [username]);
  const admin = adminRes.rows[0];

  if (!admin) {
    redirect('/login?error=Invalid+credentials');
  }

  const isValid = await bcrypt.compare(password, admin.password);

  if (!isValid) {
    redirect('/login?error=Invalid+credentials');
  }

  const session = await encrypt({ adminId: admin.id, username: admin.username });
  
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  redirect('/dashboard');
}
