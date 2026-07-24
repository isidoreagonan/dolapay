const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = getFiles('src/routes');
let fixed = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find where export const Route is
  const routeMatch = content.match(/export const Route = createFileRoute\([^)]+\)\(\{\s*(?:[^}]*,\s*)?component:\s*([A-Za-z0-9_]+)/);
  if (!routeMatch) continue;
  
  const componentName = routeMatch[1];
  const routeIndex = content.indexOf(routeMatch[0]);
  
  // Find where const Component = is
  const regexStr = 'const\\s+' + componentName + '\\s*=\\s*\\(\\)\\s*=>\\s*\\(';
  const regex = new RegExp(regexStr);
  const compMatch = content.match(regex);
  if (!compMatch) continue;
  
  const compIndex = content.indexOf(compMatch[0]);
  
  // ONLY fix if export const Route appears BEFORE const Component = () => (
  if (routeIndex < compIndex) {
    // We must manually parse to replace the EXACT arrow function.
    // Replace "const Comp = () => (" with "function Comp() {\n  return ("
    let newContent = content.substring(0, compIndex) + 'function ' + componentName + '() {\n  return (';
    
    // Now we must find the matching closing parenthese/semicolon for this specific component
    // Typically it's the last ); before the end of the file or before another export
    // A safer heuristic: the file usually ends with:
    //   </PageShell>\n);
    // Let's replace the last ); in the file since these files only contain one main component
    const remaining = content.substring(compIndex + compMatch[0].length);
    const lastParenIndex = remaining.lastIndexOf(');');
    if (lastParenIndex !== -1) {
      newContent += remaining.substring(0, lastParenIndex) + '  );\n}' + remaining.substring(lastParenIndex + 2);
      fs.writeFileSync(file, newContent);
      fixed++;
      console.log('Fixed properly ' + file);
    }
  }
}
console.log('Total fixed: ' + fixed);
