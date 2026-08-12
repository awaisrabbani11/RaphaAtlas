const fs = require('fs');

let html = fs.readFileSync('bac-calculator.html', 'utf8');

const startJson = html.indexOf('<script type="application/ld+json">', html.indexOf('FAQPage'));
if (startJson !== -1) {
    let scriptContent = html.substring(startJson);
    let endJson = scriptContent.indexOf('</script>');
    scriptContent = scriptContent.substring(0, endJson).replace('<script type="application/ld+json">', '');
    
    let parsed = JSON.parse(scriptContent);
    if (parsed.mainEntity) {
        for (const item of parsed.mainEntity) {
            let q = item.name;
            let a = item.acceptedAnswer.text;
            let qRegex = new RegExp('<h3[^>]*>' + q.replace(/[.*?^${}()|[\\]\\\\]/g, '\\\\$&') + '</h3>');
            let h3Match = html.match(qRegex);
            if (h3Match) {
                html = html.replace(qRegex, h3Match[0] + '<p class="mb-6 mt-2">' + a + '</p>');
            } else {
                console.log("Could not find h3 for", q);
            }
        }
    }
}

fs.writeFileSync('bac-calculator.html', html);
console.log("Done");
