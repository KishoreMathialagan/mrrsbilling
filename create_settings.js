const { Pool } = require('pg');
require('fs').readFileSync('.env', 'utf8').split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].replace(/^"(.*)"$/, '$1');
});
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "Settings" (
      id TEXT PRIMARY KEY,
      "gstRate" NUMERIC NOT NULL DEFAULT 18,
      "updatedAt" TIMESTAMP NOT NULL
    );
  `);
  
  const res = await pool.query('SELECT * FROM "Settings"');
  if (res.rows.length === 0) {
    await pool.query('INSERT INTO "Settings" (id, "gstRate", "updatedAt") VALUES ($1, $2, $3)', ['default', 18, new Date()]);
  }
  
  console.log("Settings table created or updated.");
  process.exit(0);
}
run();
