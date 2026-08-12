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

function updateFile(file) {
    let content = fs.readFileSync(file, 'utf8');

    // Remove logo image from header and footer
    content = content.replace(/<img[^>]*alt="RaphaAtlas Logo"[^>]*>/g, '');
    
    // Ensure the text logo looks like Healthline's (bold, approx 34px, geometric sans)
    content = content.replace(/<span class="[^"]*">RaphaAtlas<\/span>/g, '<span style="font-family: \'Proxima Nova\', \'Montserrat\', sans-serif; font-size: 34px; font-weight: 900; letter-spacing: -1px; color: white;">RaphaAtlas</span>');

    // Remove Sign In button completely
    content = content.replace(/<a[^>]*>Sign In<\/a>/g, '');
    content = content.replace(/<button[^>]*>Sign In<\/button>/g, '');
    
    // Update navigation menu. We need to find the <nav class="hidden lg:flex items-center space-x-6">
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors font-nav-link text-nav-link" href="/nutrition">Nutrition</a>
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors font-nav-link text-nav-link" href="/health">Health</a>
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors font-nav-link text-nav-link" href="/calculators">Calculators</a>
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors font-nav-link text-nav-link" href="/fitness">Fitness</a>
<div class="relative group">
<button class="flex items-center space-x-1 text-on-primary font-bold hover:text-vitality-teal transition-colors font-nav-link text-nav-link py-2">
<span>More</span>
<span class="material-symbols-outlined text-sm">expand_more</span>
</button>
<div class="absolute left-0 mt-2 w-48 bg-surface-container-lowest border border-header-black hidden group-hover:block z-50 shadow-lg">
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all font-body-md text-body-md border-b border-border-subtle" href="/about">About Us</a>
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all font-body-md text-body-md" href="/contact">Contact Us</a>
</div>
</div>
</nav> block and replace it.
    // Be careful to only replace the main nav, which contains 'Nutrition', 'Health', etc.
    const navRegex = /<nav[^>]*>([\s\S]*?)<\/nav>/;
    if (content.match(navRegex)) {
        const newNav = `<nav class="hidden lg:flex items-center space-x-6">
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors font-nav-link text-nav-link" href="/nutrition">Nutrition</a>
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors font-nav-link text-nav-link" href="/health">Health</a>
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors font-nav-link text-nav-link" href="/calculators">Calculators</a>
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors font-nav-link text-nav-link" href="/fitness">Fitness</a>
<div class="relative group">
<button class="flex items-center space-x-1 text-on-primary font-bold hover:text-vitality-teal transition-colors font-nav-link text-nav-link py-2">
<span>More</span>
<span class="material-symbols-outlined text-sm">expand_more</span>
</button>
<div class="absolute left-0 mt-2 w-48 bg-surface-container-lowest border border-header-black hidden group-hover:block z-50 shadow-lg">
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all font-body-md text-body-md border-b border-border-subtle" href="/about">About Us</a>
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all font-body-md text-body-md" href="/contact">Contact Us</a>
</div>
</div>
</nav>`;
        content = content.replace(navRegex, newNav);
    }

    fs.writeFileSync(file, content);
}

const files = getFiles('.', ['.html', '.cjs']);
files.forEach(file => {
    updateFile(file);
});
console.log('Finished updating headers and footers.');
