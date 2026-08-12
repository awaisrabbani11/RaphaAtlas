const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g);
  if (matches) {
    for (const match of matches) {
      const code = match.replace(/<script[^>]*>|<\/script>/g, '');
      try {
        new Function(code);
      } catch (e) {
        console.log(`Error in ${file}: ${e.message}`);
        console.log("Snippet:", code.substring(0, 100));
      }
    }
  }
}
