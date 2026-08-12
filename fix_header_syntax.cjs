const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // Find the exact commented section and replace it with a block comment or remove it
  content = content.replace(/\/\/ Mobile dropdown toggle logic/g, '/* Mobile dropdown toggle logic */');
  fs.writeFileSync(file, content);
}
console.log("Fixed comments in headers");
