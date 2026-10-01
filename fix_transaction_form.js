const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/TransactionForm.tsx', 'utf8');

content = content.replace(
  `export default function TransactionForm({
  customers,
  saveAction,
  defaultCustomerId,
  defaultType,
  initialData
}: {
  customers: { id: string, name: string, mobile: string }[],
  saveAction: (formData: FormData) => Promise<void>,
  defaultCustomerId?: string,
  defaultType?: string,
  initialData?: any
}) {`,
  `export default function TransactionForm({
  customers,
  saveAction,
  defaultCustomerId,
  defaultType,
  initialData,
  returnTo = '/transactions'
}: {
  customers: { id: string, name: string, mobile: string }[],
  saveAction: (formData: FormData) => Promise<void>,
  defaultCustomerId?: string,
  defaultType?: string,
  initialData?: any,
  returnTo?: string
}) {`
);

// We still need to inject the hidden input
if (!content.includes('<input type="hidden" name="returnTo"')) {
  content = content.replace(
    '<form action={saveAction} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">',
    '<form action={saveAction} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">\n      <input type="hidden" name="returnTo" value={returnTo} />'
  );
}

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/TransactionForm.tsx', content, 'utf8');
