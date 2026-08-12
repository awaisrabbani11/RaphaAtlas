const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let slug = f === 'index.html' ? '' : f.replace('.html', '');
  let canonicalUrl = `https://www.raphaatlas.com/${slug}`;
  
  content = content.replace(/<link rel="canonical"[^>]+>/g, '');
  content = content.replace(/<meta name="robots"[^>]+>/g, '');
  
  let seoTags = `\n<link rel="canonical" href="${canonicalUrl}">\n`;
  if (f === '404.html') {
    seoTags += `<meta name="robots" content="noindex, follow">\n`;
  } else {
    seoTags += `<meta name="robots" content="index, follow, max-image-preview:large">\n`;
  }
  
  if (content.includes('</title>')) {
     content = content.replace('</title>', '</title>' + seoTags);
  } else {
     content = content.replace('</head>', seoTags + '</head>');
  }
  
  fs.writeFileSync(f, content);
});
console.log('Fixed SEO tags');
