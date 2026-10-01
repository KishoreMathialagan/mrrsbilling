const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    'className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"',
    'className="bg-white rounded-xl shadow-sm border border-gray-100"'
  );
  // Add rounded top corners to header
  content = content.replace(
    'className="bg-gray-50 border-b border-gray-200"',
    'className="bg-gray-50 border-b border-gray-200 rounded-t-xl"'
  );
  content = content.replace(
    'className="overflow-x-auto"',
    'className="overflow-x-auto pb-10" ' // add some padding at the bottom so tooltip doesn't get clipped by overflow-x-auto
  );
  fs.writeFileSync(file, content, 'utf8');
}

patch('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/page.tsx');
patch('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx');

