const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/VITE_SUPABASE_URL="(.*?)"/);
const keyMatch = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="(.*?)"/);

const url = urlMatch[1];
const key = keyMatch[1];

async function run() {
  const res = await fetch(`${url}/rest/v1/?apikey=${key}`, {
    headers: {
      'Accept': 'application/openapi+json'
    }
  });
  const json = await res.json();
  fs.writeFileSync('openapi.json', JSON.stringify(json, null, 2));
  console.log("Written to openapi.json");
}

run();
