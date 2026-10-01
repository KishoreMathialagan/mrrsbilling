const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/actions.ts', 'utf8');

// Insert validation right after extracting basic fields
const validationCode = `
  if (!name || !mobile || !address) {
    throw new Error('All fields are compulsory.');
  }
  
  if (!/^\\d{10}$/.test(mobile)) {
    throw new Error('Mobile number must be exactly 10 digits.');
  }
`;

content = content.replace(
  "let photoUrl = formData.get('existingPhotoUrl') as string | null;",
  validationCode + "\n  let photoUrl = formData.get('existingPhotoUrl') as string | null;"
);

// We also need to check if photoUrl is available after processing file/webcam?
// The requirement was "all fields are compulsory". I'll add a check for photoUrl before saving.
const photoValidation = `
  if (!photoUrl) {
    throw new Error('Customer photo is compulsory.');
  }
`;

content = content.replace(
  "if (id) {",
  photoValidation + "\n  if (id) {"
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/app/(app)/customers/actions.ts', content, 'utf8');
