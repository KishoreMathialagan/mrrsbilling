const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await pool.query('ALTER TABLE "Transaction" ADD COLUMN "createdBy" TEXT DEFAULT \'System Admin\'');
    await pool.query('ALTER TABLE "Transaction" ADD COLUMN "updatedBy" TEXT DEFAULT \'System Admin\'');
    console.log('Columns added');
  } catch (e) {
    console.error(e.message);
  } finally {
    pool.end();
  }
}
run();
