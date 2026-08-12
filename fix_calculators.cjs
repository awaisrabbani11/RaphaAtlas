const fs = require('fs');

let html = fs.readFileSync('calculators.html', 'utf8');

// Replace bg-surface-cream on the cards with bg-white
html = html.replace(/class="bg-surface-cream rounded-xl/g, 'class="bg-white rounded-xl');

fs.writeFileSync('calculators.html', html);
console.log("Updated calculators.html");
