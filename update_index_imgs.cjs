const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let count = 0;
html = html.replace(/src="https:\/\/i\.pinimg\.com\/736x\/[a-f0-9\/]+\.jpg"/g, (match) => {
  count++;
  if (count === 1) {
    return 'src="https://i.pinimg.com/736x/19/af/83/19af831efa10ca721994c5b8b890721e.jpg"'; // Hero
  } else if (count === 2) {
    return 'src="https://i.pinimg.com/736x/79/02/79/790279d5949b299caa9a3d1e662c12d8.jpg"'; // Article 1
  }
  return match;
});

fs.writeFileSync('index.html', html);
console.log('Done');
