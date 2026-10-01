const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/TransactionsTable.tsx', 'utf8');

content = content.replace(
  "export default function TransactionsTable({ transactions, defaultSearch, defaultStartDate, defaultEndDate }: { transactions: any[], defaultSearch?: string, defaultStartDate?: string, defaultEndDate?: string }) {",
  "export default function TransactionsTable({ transactions, defaultSearch, defaultStartDate, defaultEndDate, defaultSort }: { transactions: any[], defaultSearch?: string, defaultStartDate?: string, defaultEndDate?: string, defaultSort?: string }) {"
);

content = content.replace(
  "<FilterBar \n        defaultSearch={defaultSearch} \n        defaultStartDate={defaultStartDate} \n        defaultEndDate={defaultEndDate} \n        searchPlaceholder=\"Search by item, customer name, mobile, receipt...\" \n      />",
  "<FilterBar \n        defaultSearch={defaultSearch} \n        defaultStartDate={defaultStartDate} \n        defaultEndDate={defaultEndDate} \n        defaultSort={defaultSort} \n        searchPlaceholder=\"Search by item, customer name, mobile, receipt...\" \n      />"
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/TransactionsTable.tsx', content, 'utf8');
