const fs = require('fs');

const img1 = 'https://i.pinimg.com/736x/3b/32/a0/3b32a00bf1acc270e2c80602f117f3db.jpg';
const img2 = 'https://i.pinimg.com/736x/19/af/83/19af831efa10ca721994c5b8b890721e.jpg';
const img3 = 'https://i.pinimg.com/736x/ae/da/61/aeda6115b36af677302f9a07c1cfb2ce.jpg';
const img4 = 'https://i.pinimg.com/736x/1f/61/a6/1f61a603f91af7b720df580313e380d7.jpg';
const img5 = 'https://i.pinimg.com/736x/d5/40/7c/d5407c6e33eda8b7f5c4ab81d8fcf850.jpg';
const img6 = 'https://i.pinimg.com/736x/ca/8d/50/ca8d5080034369cefe190a14b86e3c19.jpg';
const img7 = 'https://i.pinimg.com/736x/27/aa/57/27aa57b467a4fdbd93ded3b5a014ea7a.jpg'; // For contact?
const img8 = 'https://i.pinimg.com/736x/55/32/75/553275dc88945dfb4fc37c8a2dd97ddd.jpg'; // Spare
const img9 = 'https://i.pinimg.com/736x/79/02/79/790279d5949b299caa9a3d1e662c12d8.jpg'; // Spare

let idx = fs.readFileSync('index.html', 'utf8');

// Replace Hero Image in index.html
idx = idx.replace(/src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuClaI6E8aOLahiD[^"]*"/, `src="${img1}"`);

// Replace Article 1
idx = idx.replace(/src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuDURTZMUMDnBhNOBsnpDGD[^"]*"/, `src="${img2}"`);

// Replace Article 2
idx = idx.replace(/src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuDJ3_qciP5n9sVQ[^"]*"/, `src="${img3}"`);

// Replace Article 3 which is currently a div
// `<div class="w-full h-full bg-surface-cream flex items-center justify-center group-hover:bg-vitality-teal transition-colors">
// <span class="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-on-primary">self_improvement</span>
// </div>`
idx = idx.replace(/<div class="w-full h-full bg-surface-cream flex items-center justify-center group-hover:bg-vitality-teal transition-colors">\s*<span class="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-on-primary">self_improvement<\/span>\s*<\/div>/, 
  `<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" src="${img4}" alt="Active Recovery Strategies">`);

// Replace Article 4
idx = idx.replace(/src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuD-lziJPGTdkIadM[^"]*"/, `src="${img5}"`);

fs.writeFileSync('index.html', idx);

let abt = fs.readFileSync('about.html', 'utf8');
abt = abt.replace(/src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuD-ogxz6N_uuBQ2qes[^"]*"/, `src="${img6}"`);
fs.writeFileSync('about.html', abt);

console.log('Images replaced');
