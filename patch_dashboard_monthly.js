const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/dashboard/page.tsx', 'utf8');

const oldMonthlyQuery = `const monthlyRes = await dbQuery(\`
    SELECT to_char(date, 'MM') as month, SUM("finalPrice") as total
    FROM "Transaction"
    WHERE type = 'SALE' AND extract(year from date) = $1
    GROUP BY to_char(date, 'MM')
  \`, [parseInt(selectedYear, 10)]);`;

const newMonthlyQuery = `const monthlyRes = await dbQuery(\`
    SELECT to_char(date, 'MM') as month, 
           SUM(CASE WHEN type = 'SALE' THEN "finalPrice" ELSE 0 END) - 
           SUM(CASE WHEN type = 'PURCHASE' THEN "finalPrice" ELSE 0 END) as total
    FROM "Transaction"
    WHERE extract(year from date) = $1
    GROUP BY to_char(date, 'MM')
  \`, [parseInt(selectedYear, 10)]);`;

if (content.includes("WHERE type = 'SALE' AND extract(year from date) = $1")) {
  content = content.replace(oldMonthlyQuery, newMonthlyQuery);
  fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/dashboard/page.tsx', content, 'utf8');
  console.log('Patched monthlyRes query');
} else {
  console.log('Query not found');
}
