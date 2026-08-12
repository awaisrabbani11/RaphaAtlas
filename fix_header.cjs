const fs = require('fs');

const newHeader = `
<header class="bg-header-black border-b border-black docked full-width top-0 z-50 sticky transition-all duration-300" id="main-header">
<div class="flex justify-between items-center px-4 md:px-8 py-2 w-full max-w-7xl mx-auto">
  <a href="/" aria-label="RaphaAtlas home" class="flex items-center">
    <img src="/raphaatlas-mark.svg" alt="RaphaAtlas Logo" height="40" width="40" class="h-10 w-10">
    <span style="font-family: 'Merriweather', 'Georgia', serif; font-size: 34px; font-weight: 900; letter-spacing: -1.5px; color: white; margin-left: 12px; transform: translateY(2px);">RaphaAtlas</span>
  </a>
  <nav class="hidden lg:flex items-center space-x-6">
    <a class="text-on-primary font-bold hover:text-vitality-teal transition-colors" style="font-family: 'Inter', sans-serif;" href="/nutrition">Nutrition</a>
    <a class="text-on-primary font-bold hover:text-vitality-teal transition-colors" style="font-family: 'Inter', sans-serif;" href="/health">Health</a>
    
    <div class="relative group">
      <button class="flex items-center space-x-1 text-on-primary font-bold hover:text-vitality-teal transition-colors py-2" style="font-family: 'Inter', sans-serif;">
        <span>Calculators</span><span class="material-symbols-outlined text-sm">expand_more</span>
      </button>
      <div class="absolute left-0 mt-2 w-56 bg-surface-container-lowest border border-header-black hidden group-hover:block z-50 shadow-lg">
        <a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all border-b border-border-subtle" href="/bac-calculator">BAC Calculator</a>
        <a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all border-b border-border-subtle" href="/body-type-calculator">Body Type Calculator</a>
        <a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all border-b border-border-subtle" href="/macro-calculator">Macro Calculator</a>
        <a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all border-b border-border-subtle" href="/conception-calculator">Conception Calculator</a>
        <a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all" href="/calculators">All Calculators</a>
      </div>
    </div>
    
    <a class="text-on-primary font-bold hover:text-vitality-teal transition-colors" style="font-family: 'Inter', sans-serif;" href="/fitness">Fitness</a>
    
    <div class="relative group">
      <button class="flex items-center space-x-1 text-on-primary font-bold hover:text-vitality-teal transition-colors py-2" style="font-family: 'Inter', sans-serif;">
        <span>More</span><span class="material-symbols-outlined text-sm">expand_more</span>
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
  <div class="flex items-center space-x-4 lg:hidden">
    <button class="text-on-primary" id="mobile-menu-btn" aria-label="Toggle mobile menu">
      <span class="material-symbols-outlined text-2xl">menu</span>
    </button>
  </div>
</div>
<!-- Mobile Menu Slide-out -->
<div id="mobile-menu" class="fixed inset-y-0 right-0 w-64 bg-surface-container-lowest shadow-2xl z-[100] transform translate-x-full transition-transform duration-300 lg:hidden overflow-y-auto border-l border-border-subtle">
  <div class="p-4 border-b border-border-subtle flex justify-end">
    <button id="mobile-menu-close" class="text-on-surface hover:text-primary p-2">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <nav class="p-4 flex flex-col space-y-2">
    <a href="/nutrition" class="block py-2 text-primary font-bold border-b border-border-subtle">Nutrition</a>
    <a href="/health" class="block py-2 text-primary font-bold border-b border-border-subtle">Health</a>
    <div class="py-2 border-b border-border-subtle">
      <span class="block text-primary font-bold mb-2">Calculators</span>
      <div class="pl-4 space-y-2">
        <a href="/bac-calculator" class="block text-on-surface-variant hover:text-primary">BAC Calculator</a>
        <a href="/body-type-calculator" class="block text-on-surface-variant hover:text-primary">Body Type Calculator</a>
        <a href="/macro-calculator" class="block text-on-surface-variant hover:text-primary">Macro Calculator</a>
        <a href="/conception-calculator" class="block text-on-surface-variant hover:text-primary">Conception Calculator</a>
        <a href="/calculators" class="block text-on-surface-variant hover:text-primary">All Calculators</a>
      </div>
    </div>
    <a href="/fitness" class="block py-2 text-primary font-bold border-b border-border-subtle">Fitness</a>
    <div class="py-2">
      <span class="block text-primary font-bold mb-2">More</span>
      <div class="pl-4 space-y-2">
        <a href="/about" class="block text-on-surface-variant hover:text-primary">About Us</a>
        <a href="/editorial-policy" class="block text-on-surface-variant hover:text-primary">Editorial Policy</a>
        <a href="/medical-review-board" class="block text-on-surface-variant hover:text-primary">Medical Review Board</a>
        <a href="/privacy" class="block text-on-surface-variant hover:text-primary">Privacy Policy</a>
        <a href="/contact" class="block text-on-surface-variant hover:text-primary">Contact Us</a>
      </div>
    </div>
  </nav>
</div>
<!-- Mobile Menu Overlay -->
<div id="mobile-overlay" class="fixed inset-0 bg-black/50 z-[90] hidden lg:hidden"></div>
<script>
  (function() {
    const btn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-menu-close');
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-overlay');

    function openMenu() {
      menu.classList.remove('translate-x-full');
      overlay.classList.remove('hidden');
    }

    function closeMenu() {
      menu.classList.add('translate-x-full');
      overlay.classList.add('hidden');
    }

    if (btn) btn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
  })();
</script>
</header>
`.replace(/\n/g, '');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<header[^>]*>.*?<\/header>/, newHeader);
  fs.writeFileSync(file, content);
}
console.log("Updated headers");
