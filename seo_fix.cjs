#!/usr/bin/env node
/**
 * RaphaAtlas — deterministic SEO patcher
 * Run from repo root:  node seo_fix.cjs
 * Idempotent: safe to run repeatedly.
 */
const fs = require('fs');

const SITE = 'https://www.raphaatlas.com';
const YEAR = new Date().getFullYear();

// slug -> {title, desc}
const PAGES = {
  'index': {
    slug: '/',
    title: 'RaphaAtlas — Evidence-Based Health Tools & Guides',
    desc: 'Free clinical calculators and physician-reviewed guides on health, fitness, and nutrition. Built and reviewed by MBBS doctors.'
  },
  'calculators': {
    slug: '/calculators',
    title: 'Health Calculators — Free Clinical Tools | RaphaAtlas',
    desc: 'Free health calculators for macros, body type, blood alcohol, and conception dates. Formula-transparent and physician-reviewed.'
  },
  'macro-calculator': {
    slug: '/macro-calculator',
    title: 'Macro Calculator — Daily Protein, Carb & Fat Targets | RaphaAtlas',
    desc: 'Free macro calculator using Mifflin-St Jeor, Harris-Benedict, or Katch-McArdle. Get daily protein, carbohydrate, and fat targets for your goal.'
  },
  'bac-calculator': {
    slug: '/bac-calculator',
    title: 'BAC Calculator — Blood Alcohol Estimator (Widmark) | RaphaAtlas',
    desc: 'Free BAC calculator using the Widmark formula. Estimate blood alcohol concentration from drinks, body weight, sex, and time elapsed.'
  },
  'body-type-calculator': {
    slug: '/body-type-calculator',
    title: 'Body Type Calculator — Find Your Body Shape | RaphaAtlas',
    desc: 'Free body type calculator using bust, waist, and hip measurements. Identify your body shape with WHO-aligned waist-to-hip thresholds.'
  },
  'conception-calculator': {
    slug: '/conception-calculator',
    title: 'Conception Calculator — Estimate Conception & Due Date | RaphaAtlas',
    desc: 'Free conception calculator. Estimate your likely conception date and due date from LMP, ultrasound, or IVF transfer using Naegele dating.'
  },
  'fitness': {
    slug: '/fitness',
    title: 'Fitness — Strength, Conditioning & Recovery | RaphaAtlas',
    desc: 'Evidence-based fitness guides on strength training, conditioning, and recovery. Reviewed by practicing physicians.'
  },
  'nutrition': {
    slug: '/nutrition',
    title: 'Nutrition — Macros, Micronutrients & Eating Patterns | RaphaAtlas',
    desc: 'Evidence-based nutrition guides on macronutrients, micronutrients, and sustainable eating patterns. Physician-reviewed.'
  },
  'health': {
    slug: '/health',
    title: 'Health — Conditions, Biomarkers & Preventive Care | RaphaAtlas',
    desc: 'Evidence-based health articles on conditions, biomarkers, and preventive care, reviewed by practicing physicians for clinical accuracy.'
  },
  'about': {
    slug: '/about',
    title: 'About RaphaAtlas — Who We Are',
    desc: 'RaphaAtlas builds free, physician-reviewed health tools and guides. Learn about our mission, method, and the doctors behind the content.'
  },
  'contact': {
    slug: '/contact',
    title: 'Contact RaphaAtlas',
    desc: 'Get in touch with the RaphaAtlas team about corrections, partnerships, or medical review enquiries.'
  },
  'medical-review-board': {
    slug: '/medical-review-board',
    title: 'Medical Review Board — RaphaAtlas',
    desc: 'Meet the physicians who review RaphaAtlas health content for clinical accuracy before publication.'
  },
  'editorial-policy': {
    slug: '/editorial-policy',
    title: 'Editorial Policy — RaphaAtlas',
    desc: 'How RaphaAtlas researches, writes, reviews, and corrects its health content, and how we handle sourcing and conflicts of interest.'
  },
  'privacy': {
    slug: '/privacy',
    title: 'Privacy Policy — RaphaAtlas',
    desc: 'How RaphaAtlas collects, uses, and protects your data. Our calculators run entirely in your browser.'
  }
};

const CALCS = {
  'macro-calculator': 'Macro Calculator',
  'bac-calculator': 'BAC Calculator',
  'body-type-calculator': 'Body Type Calculator',
  'conception-calculator': 'Conception Calculator'
};

// Removes EVERY existing instance of the tag (source files ship duplicates),
// then inserts exactly one canonical version just before </head>.
function setOrReplaceHead(html, marker, tag) {
  const re = new RegExp(`[ \\t]*<(meta|link)[^>]*${marker}[^>]*>[ \\t]*\\r?\\n?`, 'gi');
  html = html.replace(re, '');
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

// Remove JSON-LD blocks this script owns, plus legacy blocks whose @type would
// duplicate what we emit. Hand-written FAQPage/HowTo blocks are preserved.
const OWNED_TYPES = new Set([
  'WebApplication', 'SoftwareApplication', 'MedicalWebPage',
  'BreadcrumbList', 'Organization', 'WebSite'
]);

function stripManagedJsonLd(html) {
  return html.replace(
    /[ \t]*<script type="application\/ld\+json"([^>]*)>([\s\S]*?)<\/script>[ \t]*\r?\n?/gi,
    (match, attrs, body) => {
      if (/data-ra=/.test(attrs)) return '';
      let parsed;
      try { parsed = JSON.parse(body); } catch { return match; } // keep unparseable, don't destroy
      const nodes = parsed['@graph'] || [parsed];
      const types = nodes.flatMap(n => [].concat(n && n['@type'] || []));
      if (types.length && types.every(t => OWNED_TYPES.has(t))) return '';
      return match; // keep FAQPage etc.
    }
  );
}

let report = [];

for (const [key, cfg] of Object.entries(PAGES)) {
  const file = `${key}.html`;
  if (!fs.existsSync(file)) { report.push(`SKIP (missing): ${file}`); continue; }
  let h = fs.readFileSync(file, 'utf8');
  const before = h;
  const url = SITE + cfg.slug;
  const changes = [];

  // 1. Title
  if (!new RegExp(`<title>${cfg.title.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}</title>`).test(h)) {
    h = h.replace(/<title>[\s\S]*?<\/title>/i, `<title>${cfg.title}</title>`);
    changes.push('title');
  }

  // 2. Meta description
  h = setOrReplaceHead(h, 'name="description"', `<meta name="description" content="${cfg.desc}">`);
  changes.push('description');

  // 3. Canonical (no trailing slash except root)
  h = setOrReplaceHead(h, 'rel="canonical"', `<link rel="canonical" href="${url}">`);

  // 4. Open Graph + Twitter
  h = setOrReplaceHead(h, 'property="og:type"', `<meta property="og:type" content="website">`);
  h = setOrReplaceHead(h, 'property="og:site_name"', `<meta property="og:site_name" content="RaphaAtlas">`);
  h = setOrReplaceHead(h, 'property="og:title"', `<meta property="og:title" content="${cfg.title}">`);
  h = setOrReplaceHead(h, 'property="og:description"', `<meta property="og:description" content="${cfg.desc}">`);
  h = setOrReplaceHead(h, 'property="og:url"', `<meta property="og:url" content="${url}">`);
  h = setOrReplaceHead(h, 'property="og:image"', `<meta property="og:image" content="${SITE}/og-image.png">`);
  h = setOrReplaceHead(h, 'name="twitter:card"', `<meta name="twitter:card" content="summary_large_image">`);
  h = setOrReplaceHead(h, 'name="twitter:title"', `<meta name="twitter:title" content="${cfg.title}">`);
  h = setOrReplaceHead(h, 'name="twitter:description"', `<meta name="twitter:description" content="${cfg.desc}">`);
  h = setOrReplaceHead(h, 'name="twitter:image"', `<meta name="twitter:image" content="${SITE}/og-image.png">`);
  changes.push('og/twitter');

  // 5. Robots
  h = setOrReplaceHead(h, 'name="robots"', `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`);

  // 6. Brand misspelling anywhere in the document
  if (/rafaatlas/i.test(h)) { h = h.replace(/rafaatlas\.com/gi, 'RaphaAtlas').replace(/rafaatlas/gi, 'RaphaAtlas'); changes.push('brand-typo'); }

  // 7. Stale copyright
  h = h.replace(/©\s*20\d{2}\s*RaphaAtlas/gi, `© ${YEAR} RaphaAtlas`);

  // 8. H1 hygiene
  const h1s = h.match(/<h1[\s>]/gi) || [];
  if (h1s.length > 1) {
    let seen = 0;
    h = h.replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/gi, (m, attrs, inner) => {
      seen++;
      return seen === 1 ? m : `<h2${attrs}>${inner}</h2>`;
    });
    changes.push(`demoted ${h1s.length - 1} extra h1`);
  } else if (h1s.length === 0) {
    let done = false;
    h = h.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/i, (m, attrs, inner) => {
      if (done) return m; done = true;
      return `<h1${attrs}>${inner}</h1>`;
    });
    if (done) changes.push('promoted h2 -> h1');
  }

  // 9. Structured data
  h = stripManagedJsonLd(h);

  const blocks = [];

  if (key === 'index') {
    blocks.push(JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": SITE + "/#organization",
          "name": "RaphaAtlas",
          "url": SITE + "/",
          "logo": { "@type": "ImageObject", "url": SITE + "/raphaatlas-lockup.svg" },
          "parentOrganization": { "@type": "Organization", "name": "Growth Partners Global LLC" }
        },
        {
          "@type": "WebSite",
          "@id": SITE + "/#website",
          "url": SITE + "/",
          "name": "RaphaAtlas",
          "description": PAGES.index.desc,
          "publisher": { "@id": SITE + "/#organization" },
          "inLanguage": "en"
        }
      ]
    }));
  }

  if (CALCS[key]) {
    blocks.push(JSON.stringify({
      "@context": "https://schema.org",
      "@type": ["WebApplication", "MedicalWebPage"],
      "name": CALCS[key],
      "url": url,
      "description": cfg.desc,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Any (web browser)",
      "browserRequirements": "Requires JavaScript",
      "isAccessibleForFree": true,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "inLanguage": "en",
      "publisher": { "@id": SITE + "/#organization" },
      "reviewedBy": {
        "@type": "Person",
        "name": "Dr. Muhammad Awais Rabbani, MBBS",
        "jobTitle": "Medical Reviewer",
        "url": SITE + "/medical-review-board"
      },
      "lastReviewed": new Date().toISOString().slice(0, 10)
    }));
  }

  // Breadcrumbs for non-root pages
  if (key !== 'index') {
    blocks.push(JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/" },
        { "@type": "ListItem", "position": 2, "name": cfg.title.split(/\s[—|]\s/)[0], "item": url }
      ]
    }));
  }

  if (blocks.length) {
    const payload = blocks
      .map(b => `  <script type="application/ld+json" data-ra="page">${b}</script>`)
      .join('\n');
    h = h.replace(/<\/head>/i, payload + '\n</head>');
    changes.push('json-ld');
  }

  if (h !== before) {
    fs.writeFileSync(file, h);
    report.push(`PATCHED ${file}: ${changes.join(', ')}`);
  } else {
    report.push(`OK      ${file}: no change needed`);
  }
}

// 404 must stay noindex
if (fs.existsSync('404.html')) {
  let h = fs.readFileSync('404.html', 'utf8');
  h = setOrReplaceHead(h, 'name="robots"', `<meta name="robots" content="noindex, follow">`);
  h = h.replace(/[ \t]*<meta property="og:url"[^>]*>\r?\n?/i, '');
  h = h.replace(/rafaatlas\.com/gi, 'RaphaAtlas');
  if (!/<h1[\s>]/i.test(h)) {
    let done = false;
    h = h.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/i, (m, a, i) => { if (done) return m; done = true; return `<h1${a}>${i}</h1>`; });
  }
  fs.writeFileSync('404.html', h);
  report.push('PATCHED 404.html: noindex, h1, og:url removed');
}

// llms.txt — strip trailing slashes (they 308-redirect under trailingSlash:false)
if (fs.existsSync('llms.txt')) {
  let t = fs.readFileSync('llms.txt', 'utf8');
  t = t.replace(/(https:\/\/www\.raphaatlas\.com\/[a-z0-9-]+)\//g, '$1');
  fs.writeFileSync('llms.txt', t);
  report.push('PATCHED llms.txt: removed trailing slashes');
}

// sitemap.xml — regenerate with lastmod
const today = new Date().toISOString().slice(0, 10);
const priority = { '/': '1.0', '/calculators': '0.9' };
const entries = Object.values(PAGES).map(p => {
  const pr = priority[p.slug] || (p.slug.includes('calculator') ? '0.9' : '0.6');
  return `  <url><loc>${SITE + p.slug}</loc><lastmod>${today}</lastmod><priority>${pr}</priority></url>`;
});
fs.writeFileSync('sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`);
report.push('REGENERATED sitemap.xml with lastmod');

console.log(report.join('\n'));
