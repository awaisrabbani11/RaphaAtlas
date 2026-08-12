const fs = require('fs');

let html = fs.readFileSync('bac-calculator.html', 'utf8');

const jsonMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
let faqJson = null;

for (const m of jsonMatch) {
    if (m.includes('FAQPage')) {
        const jsonStr = m.replace(/<script type="application\/ld\+json">|<\/script>/g, '');
        faqJson = JSON.parse(jsonStr);
    }
}

if (faqJson && faqJson.mainEntity) {
    for (const faq of faqJson.mainEntity) {
        const q = faq.name;
        const a = faq.acceptedAnswer.text;
        
        // Find the <h3> with this question
        // e.g. <h3 class="font-bold text-primary mt-8 mb-2">What Does BAC Stand For?</h3>
        const regex = new RegExp('<h3[^>]*>' + q.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&') + '</h3>');
        const h3Match = html.match(regex);
        
        if (h3Match) {
            html = html.replace(regex, h3Match[0] + '\\n<p class="mb-6">' + a + '</p>');
        }
    }
}

fs.writeFileSync('bac-calculator.html', html);
console.log("Fixed answers");
