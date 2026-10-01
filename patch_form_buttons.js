const fs = require('fs');

function replaceBlueBtn(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  content = content.replaceAll(
    'bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors',
    'bg-[#111] text-white rounded-xl hover:bg-black font-bold shadow-lg shadow-black/10 transition-colors'
  );
  fs.writeFileSync(filepath, content, 'utf8');
}

replaceBlueBtn('/home/shaktimaan/Documents/mrrs_billing/src/components/TransactionForm.tsx');
replaceBlueBtn('/home/shaktimaan/Documents/mrrs_billing/src/components/CustomerForm.tsx');
replaceBlueBtn('/home/shaktimaan/Documents/mrrs_billing/src/components/ReceiptForm.tsx');

