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
            
            // just replace exactly:
            let h3str = '<h3 class="font-bold text-primary mt-8 mb-2">' + q + '</h3>';
            if (html.includes(h3str)) {
                html = html.replace(h3str, h3str + '<p class="mb-6 mt-2">' + a + '</p>');
                console.log("Replaced", q);
            } else {
                console.log("Could not find exactly", h3str);
            }
        }
    }
}

fs.writeFileSync('bac-calculator.html', html);
console.log("Done");
