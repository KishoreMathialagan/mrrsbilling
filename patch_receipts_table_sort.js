const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/ReceiptsTable.tsx', 'utf8');

content = content.replace(
  "export default function ReceiptsTable({ receipts, defaultSearch, defaultStartDate, defaultEndDate }: { receipts: any[], defaultSearch?: string, defaultStartDate?: string, defaultEndDate?: string }) {",
  "export default function ReceiptsTable({ receipts, defaultSearch, defaultStartDate, defaultEndDate, defaultSort }: { receipts: any[], defaultSearch?: string, defaultStartDate?: string, defaultEndDate?: string, defaultSort?: string }) {"
);

content = content.replace(
  "<FilterBar \n        defaultSearch={defaultSearch} \n        defaultStartDate={defaultStartDate} \n        defaultEndDate={defaultEndDate} \n        searchPlaceholder=\"Search by receipt number, customer name, mobile...\" \n      />",
  "<FilterBar \n        defaultSearch={defaultSearch} \n        defaultStartDate={defaultStartDate} \n        defaultEndDate={defaultEndDate} \n        defaultSort={defaultSort} \n        searchPlaceholder=\"Search by receipt number, customer name, mobile...\" \n      />"
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/receipts/ReceiptsTable.tsx', content, 'utf8');
