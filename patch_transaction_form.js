const fs = require('fs');
const file = '/home/shaktimaan/Documents/mrrs_billing/src/components/TransactionForm.tsx';
let content = fs.readFileSync(file, 'utf8');

// Modify props to accept defaultCustomerId and defaultType
content = content.replace(
  'saveAction: (formData: FormData) => Promise<void>',
  'saveAction: (formData: FormData) => Promise<void>,\n  defaultCustomerId?: string,\n  defaultType?: string'
);
content = content.replace(
  'saveAction\n}: {',
  'saveAction,\n  defaultCustomerId,\n  defaultType\n}: {'
);

// Modify state initializations
content = content.replace(
  'const [selectedCustomerId, setSelectedCustomerId] = useState(\'\');',
  'const [selectedCustomerId, setSelectedCustomerId] = useState(defaultCustomerId || \'\');'
);

content = content.replace(
  'const [customerSearch, setCustomerSearch] = useState(\'\');',
  'const [customerSearch, setCustomerSearch] = useState(\'\');\n  \n  useEffect(() => {\n    if (defaultCustomerId && customers) {\n      const c = customers.find(c => c.id === defaultCustomerId);\n      if (c) {\n        setCustomerSearch(`${c.name} (${c.mobile})`);\n      }\n    }\n  }, [defaultCustomerId, customers]);'
);

content = content.replace(
  '<select name="type" required',
  '<select name="type" required defaultValue={defaultType || "SALE"}'
);

fs.writeFileSync(file, content, 'utf8');
