const fs = require('fs');
const file = '/home/shaktimaan/Documents/mrrs_billing/scripts/init.sql';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '"receiptId" TEXT REFERENCES "Receipt"("id") ON DELETE SET NULL ON UPDATE CASCADE,',
  '"receiptId" TEXT REFERENCES "Receipt"("id") ON DELETE SET NULL ON UPDATE CASCADE,\n  "createdBy" TEXT,\n  "updatedBy" TEXT,'
);

fs.writeFileSync(file, content, 'utf8');
