import { Metadata } from 'next';
import { query as dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminClient from './AdminClient';

export const metadata: Metadata = {
  title: 'Admin - MRRS Billing',
  description: 'Admin dashboard',
};

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const res = await dbQuery('SELECT id, username, "createdAt" FROM "Admin" ORDER BY "createdAt" ASC');
  const admins = res.rows;

  const settingsRes = await dbQuery('SELECT * FROM "Settings" WHERE id = $1', ['default']);
  const settings = settingsRes.rows[0] || { gstRate: 18 };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
      </div>
      <AdminClient admins={admins} currentAdminId={session.adminId} settings={settings} />
    </div>
  );
}
