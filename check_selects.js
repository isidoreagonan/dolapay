const fs = require('fs');
const path = require('path');
function s(dir) {
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory() && !fp.includes('node_modules')) s(fp);
    else if (fp.endsWith('.tsx') || fp.endsWith('.ts')) {
      const c = fs.readFileSync(fp, 'utf8');
      const r = /\.from\(['"]([^'"]+)['"]\)\s*\.select\(['"]([^'"]+)['"]/g;
      let m;
      while ((m = r.exec(c)) !== null) {
        console.log(`${fp} -> ${m[1]} : ${m[2]}`);
      }
    }
  });
}
s('./src');
