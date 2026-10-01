const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/CustomerForm.tsx', 'utf8');

// Add onSubmit to the form
content = content.replace(
  '<form action={saveCustomer}',
  '<form \n      action={saveCustomer}\n      onSubmit={(e) => {\n        if (!preview) {\n          e.preventDefault();\n          alert("Customer photo is compulsory. Please take a photo or upload one.");\n        }\n      }}\n      '
);

// Make address required
content = content.replace(
  '<textarea name="address" rows={4} defaultValue={initialData?.address}',
  '<textarea name="address" rows={4} defaultValue={initialData?.address} required'
);

// Update mobile input
content = content.replace(
  /<input type="tel" name="mobile" defaultValue=\{initialData\?\.mobile\} required className="([^"]+)" placeholder="e.g. \+91 9876543210" \/>/,
  `<input 
              type="tel" 
              name="mobile" 
              defaultValue={initialData?.mobile} 
              required 
              pattern="[0-9]{10}"
              maxLength={10}
              title="Mobile number must be exactly 10 digits (e.g. 9876543210)"
              className="$1" 
              placeholder="e.g. 9876543210" 
            />`
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/CustomerForm.tsx', content, 'utf8');
