const fs = require('fs');
const path = require('path');

function getFiles(dir, extArray, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, extArray, fileList);
        } else {
            if (extArray.includes(path.extname(filePath))) {
                fileList.push(filePath);
            }
        }
    }
    return fileList;
}

const headLinks = `<link rel="stylesheet" href="/tailwind.css">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Montserrat:wght@600;700;900&family=Archivo:wght@700&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="/raphaatlas-favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">`;

const headerHtml = `<header class="bg-header-black border-b border-black docked full-width top-0 z-50 sticky transition-all duration-300">
<div class="flex justify-between items-center px-4 md:px-8 py-2 w-full max-w-7xl mx-auto">
<a href="/" aria-label="RaphaAtlas home" class="flex items-center">
  <img src="/raphaatlas-mark.svg" alt="RaphaAtlas Logo" height="40" width="40" class="h-10 w-10">
  <span style="font-family: 'Merriweather', 'Georgia', serif; font-size: 34px; font-weight: 900; letter-spacing: -1.5px; color: white; margin-left: 12px; transform: translateY(2px);">RaphaAtlas</span>
</a>
<nav class="hidden lg:flex items-center space-x-6">
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors" style="font-family: 'Inter', sans-serif;" href="/nutrition">Nutrition</a>
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors" style="font-family: 'Inter', sans-serif;" href="/health">Health</a>
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors" style="font-family: 'Inter', sans-serif;" href="/calculators">Calculators</a>
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors" style="font-family: 'Inter', sans-serif;" href="/fitness">Fitness</a>
<div class="relative group">
<button class="flex items-center space-x-1 text-on-primary font-bold hover:text-vitality-teal transition-colors py-2" style="font-family: 'Inter', sans-serif;">
<span>More</span>
<span class="material-symbols-outlined text-sm">expand_more</span>
</button>
<div class="absolute left-0 mt-2 w-56 bg-surface-container-lowest border border-header-black hidden group-hover:block z-50 shadow-lg">
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all border-b border-border-subtle" href="/about">About Us</a>
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all border-b border-border-subtle" href="/editorial-policy">Editorial Policy</a>
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all border-b border-border-subtle" href="/medical-review-board">Medical Review Board</a>
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all border-b border-border-subtle" href="/privacy">Privacy Policy</a>
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all" href="/contact">Contact Us</a>
</div>
</div>
</nav>
<div class="flex items-center space-x-4">
<button class="text-on-primary hover:text-vitality-teal transition-colors"><span class="material-symbols-outlined">search</span></button>
<button class="lg:hidden text-on-primary"><span class="material-symbols-outlined text-2xl">menu</span></button>
</div>
</div>
</header>`;

const footerHtml = `<footer class="bg-header-black text-on-primary w-full py-12 px-4 md:px-8 flex flex-col md:flex-row justify-between mt-auto">
<div class="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center">
<div class="mb-8 md:mb-0">
<a href="/" class="flex items-center mb-2">
  <img src="/raphaatlas-mark.svg" alt="RaphaAtlas" height="50" width="50" class="h-12 w-12">
  <span style="font-family: 'Merriweather', 'Georgia', serif; font-size: 40px; font-weight: 900; letter-spacing: -1.5px; color: white; margin-left: 14px; transform: translateY(2px);">RaphaAtlas</span>
</a>
</div>
<div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8" style="font-family: 'Inter', sans-serif;">
<a class="text-on-primary opacity-50 hover:opacity-100 transition-opacity" href="/about">About Us</a>
<a class="text-on-primary opacity-50 hover:opacity-100 transition-opacity" href="/editorial-policy">Editorial Policy</a>
<a class="text-on-primary opacity-50 hover:opacity-100 transition-opacity" href="/medical-review-board">Medical Review Board</a>
<a class="text-on-primary opacity-50 hover:opacity-100 transition-opacity" href="/contact">Contact</a>
<a class="text-on-primary opacity-50 hover:opacity-100 transition-opacity" href="/privacy">Privacy Policy</a>
</div>
<div class="mt-8 md:mt-0 text-on-primary opacity-30 text-sm" style="font-family: 'Inter', sans-serif;">© 2024 RaphaAtlas. All rights reserved.</div>
</div>
</footer>`;

const files = getFiles('.', ['.html', '.cjs']);

files.forEach(file => {
    if (file === 'unify_layout.cjs') return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Inject head links
    if (!content.includes('apple-touch-icon.png')) {
        content = content.replace('<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@900&display=swap" rel="stylesheet">
</head>', headLinks + '\n</head>');
    }

    // 2. Replace Header
    const headerRegex = /<header[\s\S]*?<\/header>/;
    if (content.match(headerRegex)) {
        content = content.replace(headerRegex, headerHtml);
    } else {
        const bodyRegex = /<body[^>]*>/;
        content = content.replace(bodyRegex, '$&\n' + headerHtml);
    }

    // 3. Replace Footer
    const footerRegex = /<footer[\s\S]*?<\/footer>/;
    if (content.match(footerRegex)) {
        content = content.replace(footerRegex, footerHtml);
    } else {
        content = content.replace('</body>', footerHtml + '\n</body>');
    }
    
    // Also remove old navigation crumbs block from old files like health.html
    const navCrumbsRegex = /<nav class="wrap crumbs"[^>]*>([\s\S]*?)<\/nav>/;
    if (content.match(navCrumbsRegex)) {
        content = content.replace(navCrumbsRegex, '');
    }

    fs.writeFileSync(file, content);
});

console.log('Unification complete.');
