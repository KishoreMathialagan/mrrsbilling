import { query } from './src/lib/db.js';
import * as dotenv from 'dotenv';
dotenv.config();
console.log(process.env.DATABASE_URL);
query('SELECT 1').then(() => console.log('OK')).catch(console.error);
