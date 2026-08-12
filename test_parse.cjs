const fs = require('fs');
const rawMarkdown = fs.readFileSync('bac_raw.md', 'utf8');
let mdText = rawMarkdown.replace(/\*\*/g, '');
const lines = mdText.split('\n');

for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line.startsWith('FAQ:') || line.endsWith('?')) {
        let isFaq = false;
        if (line.startsWith('FAQ:') && line.endsWith('?')) {
            isFaq = true;
        } else if (line.endsWith('?')) {
            isFaq = true;
        }

        if (isFaq) {
            console.log("Q:", line);
            let answer = [];
            let j = i + 1;
            while (j < lines.length && !lines[j].startsWith('FAQ:') && !lines[j].startsWith('#')) {
                if (lines[j].startsWith('|')) break;
                if (lines[j].trim() !== '') {
                    answer.push(lines[j].trim());
                }
                j++;
            }
            console.log("A:", answer);
            i = j - 1;
        }
    }
}
