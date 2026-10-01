const fs = require('fs');

function fixTooltip(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    'absolute left-12 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col z-50 bg-gray-300',
    'absolute left-10 top-full mt-1 hidden group-hover:flex flex-col z-[100] bg-gray-300'
  );
  fs.writeFileSync(file, content, 'utf8');
}

fixTooltip('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/transactions/page.tsx');
fixTooltip('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/[id]/page.tsx');
