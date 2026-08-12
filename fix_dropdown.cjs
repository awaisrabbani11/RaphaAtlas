const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/class="absolute left-0 mt-2 w-56 bg-surface-container-lowest border border-header-black hidden group-hover:block z-50 shadow-lg before:content-\[\\x27\\x27\] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4"/g,
    'class="absolute left-0 mt-2 w-56 bg-surface-container-lowest border border-header-black hidden group-hover:block z-50 shadow-lg"');
  
  content = content.replace(/class="absolute left-0 mt-2 w-56 bg-surface-container-lowest border border-header-black hidden group-hover:block z-50 shadow-lg"/g,
    `class="absolute left-0 mt-2 w-56 bg-surface-container-lowest border border-header-black hidden group-hover:block z-50 shadow-lg before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4"`);
  fs.writeFileSync(file, content);
}
console.log('Done dropdown');
