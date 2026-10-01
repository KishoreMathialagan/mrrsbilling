const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');
  // Restore overflow-hidden on the wrapper
  content = content.replace(
    'className="bg-white rounded-xl shadow-sm border border-gray-100"',
    'className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"'
  );
  // Remove rounded-t-xl from the header since overflow-hidden handles it
  content = content.replace(
    'className="bg-gray-50 border-b border-gray-200 rounded-t-xl"',
    'className="bg-gray-50 border-b border-gray-200"'
  );
  fs.writeFileSync(file, content, 'utf8');
}

patch('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/page.tsx');
patch('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx');

