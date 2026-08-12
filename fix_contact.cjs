const fs = require('fs');

let content = fs.readFileSync('contact.html', 'utf8');

const newContent = `dr.awais@growthpartnersgloballlc.com<br>dr.ahmed@growthpartnersgloballlc.com`;

content = content.replace('hello@rafaatlas.com', newContent);
fs.writeFileSync('contact.html', content);
console.log("Replaced contact.html email successfully.");
