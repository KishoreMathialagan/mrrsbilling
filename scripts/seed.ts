import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const password = await bcrypt.hash('admin123', 10);
  
  const res = await pool.query('SELECT * FROM "Admin" WHERE username = $1', ['admin']);
  if (res.rows.length === 0) {
    await pool.query('INSERT INTO "Admin" (username, password) VALUES ($1, $2)', ['admin', password]);
    console.log('Created admin: admin');
  } else {
    console.log('Admin already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
