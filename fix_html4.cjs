const fs = require('fs');

let html = fs.readFileSync('bac-calculator.html', 'utf8');

const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
let match;
let faqJson;
while ((match = regex.exec(html)) !== null) {
  if (match[1].includes('FAQPage')) {
    faqJson = JSON.parse(match[1]);
  }
}

if (faqJson && faqJson.mainEntity) {
    for (const item of faqJson.mainEntity) {
        let q = item.name;
        let a = item.acceptedAnswer.text;
        let h3str = '<h3 class="font-bold text-primary mt-8 mb-2">' + q + '</h3>';
        if (html.includes(h3str)) {
            html = html.replace(h3str, h3str + '<p class="mb-6 mt-2">' + a + '</p>');
            console.log("Replaced", q);
        } else {
            console.log("Could not find", h3str);
        }
    }
    fs.writeFileSync('bac-calculator.html', html);
}
console.log("Done");
