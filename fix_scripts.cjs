const fs = require('fs');

const files = ['bac-calculator.html', 'macro-calculator.html', 'conception-calculator.html'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the last <script> tag before </body>
  const scriptRegex = /<script>\s*document\.getElementById\('(?:bacForm|conceptForm)'\)\.addEventListener\('submit'[\s\S]*?<\/script>\s*<\/body>/g;
  
  if (scriptRegex.test(content)) {
    content = content.replace(scriptRegex, '</body>');
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  } else {
    // maybe there's some other stuff? Let's just remove any <script> right before </body> that has document.getElementById.*addEventListener('submit'
    const fallbackRegex = /<script>[\s\S]*?addEventListener\('submit'[\s\S]*?<\/script>\s*<\/body>/g;
    if (fallbackRegex.test(content)) {
      content = content.replace(fallbackRegex, '</body>');
      fs.writeFileSync(file, content);
      console.log(`Fixed fallback ${file}`);
    } else {
      console.log(`Could not find script block in ${file}`);
    }
  }
}
