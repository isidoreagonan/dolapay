const fs = require('fs');
const files = [
  'src/routes/developers/api/route.tsx',
  'src/routes/developers/api/auth.tsx',
  'src/routes/developers/api/checkout-pay.tsx',
  'src/routes/developers/api/checkout-sessions.tsx',
  'src/routes/developers/api/webhooks.tsx',
  'src/routes/developers/api/errors.tsx',
  'src/components/developers/CodeTabs.tsx'
];
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let text = fs.readFileSync(f, 'utf8');
  text = text.replace(/\\\$/g, '$');
  text = text.replace(/\\`/g, '`');
  text = text.replace(/\\\\/g, '\\');
  fs.writeFileSync(f, text);
}
console.log('Fixed files');
