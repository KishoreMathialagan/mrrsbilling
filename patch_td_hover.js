const fs = require('fs');

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/text-gray-600/g, 'text-gray-600 group-hover:text-black');
  content = content.replace(/text-gray-500/g, 'text-gray-500 group-hover:text-black');
  content = content.replace(/text-gray-900/g, 'text-gray-900 group-hover:text-black');
  fs.writeFileSync(file, content, 'utf8');
}

processFile('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/page.tsx');
processFile('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx');
