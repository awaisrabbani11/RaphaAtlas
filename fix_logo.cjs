const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Header Logo
  content = content.replace(
    /<span style="font-family: 'Merriweather', 'Georgia', serif; font-size: 34px; font-weight: 900; letter-spacing: -1.5px; color: white; margin-left: 12px; transform: translateY\(2px\);">RaphaAtlas<\/span>/g,
    `<span style="font-family: 'Inter', sans-serif; font-size: 32px; font-weight: 900; letter-spacing: -1px; color: white; margin-left: 12px; transform: translateY(2px);">RaphaAtlas</span>`
  );
  
  // Footer Logo
  content = content.replace(
    /<span style="font-family: 'Merriweather', 'Georgia', serif; font-size: 40px; font-weight: 900; letter-spacing: -1.5px; color: white; margin-left: 14px; transform: translateY\(2px\);">RaphaAtlas<\/span>/g,
    `<span style="font-family: 'Inter', sans-serif; font-size: 36px; font-weight: 900; letter-spacing: -1px; color: white; margin-left: 14px; transform: translateY(2px);">RaphaAtlas</span>`
  );
  
  fs.writeFileSync(file, content);
}

console.log("Updated logos");
