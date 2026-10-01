const fs = require('fs');
const file = '/home/shaktimaan/Documents/mrrs_billing/src/components/TransactionForm.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add initialData to props
content = content.replace(
  'defaultType?: string',
  'defaultType?: string,\n  initialData?: any'
);
content = content.replace(
  'defaultType\n}: {',
  'defaultType,\n  initialData\n}: {'
);

// Add initialization of state with initialData
const oldStateInit = `  const [weight, setWeight] = useState<number | ''>('');
  const [touch, setTouch] = useState<number | ''>('');
  const [wastage, setWastage] = useState<number | ''>('');
  const [makerCharge, setMakerCharge] = useState<number | ''>('');
  const [gstEnabled, setGstEnabled] = useState<boolean>(false);
  const [remark, setRemark] = useState<string>('');`;

const newStateInit = `  const [weight, setWeight] = useState<number | ''>(initialData?.weight || '');
  const [touch, setTouch] = useState<number | ''>(initialData?.touch || '');
  const [wastage, setWastage] = useState<number | ''>(initialData?.wastage || '');
  const [makerCharge, setMakerCharge] = useState<number | ''>(initialData?.makerCharge || '');
  const [gstEnabled, setGstEnabled] = useState<boolean>(initialData?.gstEnabled || false);
  const [remark, setRemark] = useState<string>(initialData?.remark || '');
  const [itemName, setItemName] = useState<string>(initialData?.itemName || '');
  const [date, setDate] = useState<string>(initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);`;

content = content.replace(oldStateInit, newStateInit);

// Replace default values in JSX
content = content.replace(
  '<input type="date" name="date" required defaultValue={new Date().toISOString().split(\'T\')[0]}',
  '<input type="date" name="date" required value={date} onChange={e => setDate(e.target.value)}'
);

content = content.replace(
  '<input type="text" name="itemName" required className',
  '<input type="text" name="itemName" required value={itemName} onChange={e => setItemName(e.target.value)} className'
);

fs.writeFileSync(file, content, 'utf8');
