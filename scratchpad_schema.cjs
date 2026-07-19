const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/VITE_SUPABASE_URL="(.*?)"/);
const keyMatch = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="(.*?)"/);

if (!urlMatch || !keyMatch) {
  console.log("No env");
  process.exit(1);
}

const url = urlMatch[1];
const key = keyMatch[1];

async function run() {
  const res = await fetch(`${url}/rest/v1/?apikey=${key}`);
  const json = await res.json();
  const def = json.components?.schemas?.kyc_documents || json.definitions?.kyc_documents;
  console.log(JSON.stringify(def, null, 2));
}

run();
