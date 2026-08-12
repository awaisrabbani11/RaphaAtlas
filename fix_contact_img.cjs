const fs = require('fs');

const img7 = 'https://i.pinimg.com/736x/27/aa/57/27aa57b467a4fdbd93ded3b5a014ea7a.jpg';

let html = fs.readFileSync('contact.html', 'utf8');
const toInsert = `
<div class="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden shadow-sm h-64 mb-8">
  <img src="${img7}" alt="Contact Us" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500">
</div>
`;

html = html.replace('<!-- Direct Contact & Socials -->', '<!-- Direct Contact & Socials -->\n' + toInsert);

fs.writeFileSync('contact.html', html);
console.log('Contact image added');
