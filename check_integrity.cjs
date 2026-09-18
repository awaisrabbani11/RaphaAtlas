#!/usr/bin/env node
/* RaphaAtlas — structural integrity gate for the static HTML.
   Run:  node check_integrity.cjs      (or: npm run check:integrity)

   Exists because three scripts in this repo rewrite every .html file with
   regex, and a malformed <head> deployed site-wide is both easy to produce
   and invisible in a browser that silently repairs it. Run this after any
   bulk rewrite and before committing. Exits non-zero on failure.

   Checks, per file:
     - parses under parse5 (the spec-compliant parser Googlebot's renderer
       uses) with zero parse errors
     - exactly one <html>, <head>, <body>, <title>, each properly closed
     - non-empty <title>
     - <script> opens == closes
     - every application/ld+json block is valid JSON
     - no zero-width / NBSP characters (U+200B/C/D, U+FEFF, U+00A0), which
       break parsing while looking fine in some browsers
     - exactly one <main>, holding text above a floor. Measured inside <main>,
       NOT <body>: the shared nav and footer contribute ~1,120 chars to every
       page, so a <body> floor low enough to be meaningful still passes a page
       whose entire <main> has been deleted. Chrome is not content.
   Plus, across the repo:
     - every sitemap <loc> resolves to a real file (cleanUrls: true)
     - every indexable .html file appears in the sitemap
*/
const fs = require('fs');
const path = require('path');
const { parse } = require('parse5');

const ROOT = __dirname;
const MIN_MAIN_TEXT = 500;          // chars of visible text inside <main>
/* 404.html is exempt from both the <main> requirement and the text floor: it is
   noindex, deliberately short, and currently ships no <main> landmark at all
   (every other page has one — worth adding, but it is not an integrity fault). */
const EXEMPT_MAIN = new Set(['404.html']);
const NOT_IN_SITEMAP = new Set(['404.html']);
const BAD_CHARS = /[​‌‍﻿ ]/g;
const SKIP_TEXT = new Set(['script', 'style', 'noscript', 'template', 'svg']);

let failures = [];
const fail = (file, msg) => failures.push(`${file}: ${msg}`);

const walk = (node, fn) => {
  fn(node);
  for (const k of node.childNodes || []) walk(k, fn);
};

const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
if (!htmlFiles.length) { console.error('no .html files found'); process.exit(1); }

for (const file of htmlFiles) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const count = re => (src.match(re) || []).length;

  // --- raw tag balance, checked on bytes so parser recovery cannot mask it
  for (const [tag, open, close] of [
    ['html', count(/<html\b/gi), count(/<\/html\s*>/gi)],
    ['head', count(/<head\b/gi), count(/<\/head\s*>/gi)],
    ['body', count(/<body\b/gi), count(/<\/body\s*>/gi)],
    ['title', count(/<title\b/gi), count(/<\/title\s*>/gi)],
  ]) {
    if (open !== 1 || close !== 1) fail(file, `expected exactly one <${tag}> and one </${tag}>, found ${open}/${close}`);
  }
  const sOpen = count(/<script\b/gi), sClose = count(/<\/script\s*>/gi);
  if (sOpen !== sClose) fail(file, `unbalanced <script>: ${sOpen} open vs ${sClose} close`);

  // --- invisible characters, flagged with line number and whether inside a tag
  BAD_CHARS.lastIndex = 0;
  let m;
  while ((m = BAD_CHARS.exec(src))) {
    const line = src.slice(0, m.index).split('\n').length;
    const before = src.slice(Math.max(0, m.index - 40), m.index);
    const inTag = before.lastIndexOf('<') > before.lastIndexOf('>');
    const cp = 'U+' + m[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
    fail(file, `${cp} at line ${line}${inTag ? ' INSIDE A TAG (breaks parsing)' : ''}`);
  }

  // --- parse5
  const errors = [];
  let doc;
  try {
    doc = parse(src, { onParseError: e => errors.push(e.code) });
  } catch (e) {
    fail(file, `parse threw: ${e.message}`);
    continue;
  }
  if (errors.length) {
    const uniq = [...new Set(errors)].slice(0, 5).join(', ');
    fail(file, `${errors.length} parse error(s): ${uniq}`);
  }

  let title = null, mainText = '', mainCount = 0, ld = 0;
  walk(doc, n => {
    const tag = n.tagName && n.tagName.toLowerCase();
    if (tag === 'title' && title === null) title = (n.childNodes || []).map(c => c.value || '').join('');
    if (tag === 'script') {
      const type = (n.attrs || []).find(a => a.name === 'type');
      if (type && type.value.toLowerCase() === 'application/ld+json') {
        ld++;
        const body = (n.childNodes || []).map(c => c.value || '').join('');
        try { JSON.parse(body); }
        catch (e) { fail(file, `JSON-LD block #${ld} is invalid JSON: ${e.message.slice(0, 80)}`); }
      }
    }
    if (tag === 'main') {
      mainCount++;
      const collect = (node, skipping) => {
        const t = node.tagName && node.tagName.toLowerCase();
        const skip = skipping || (t && SKIP_TEXT.has(t));
        if (node.nodeName === '#text' && !skip) mainText += node.value;
        for (const k of node.childNodes || []) collect(k, skip);
      };
      collect(n, false);
    }
  });

  if (!title || !title.trim()) fail(file, 'missing or empty <title>');
  if (!EXEMPT_MAIN.has(file) && mainCount !== 1) fail(file, `expected exactly one <main>, found ${mainCount}`);
  const textLen = mainText.replace(/\s+/g, ' ').trim().length;
  if (!EXEMPT_MAIN.has(file) && mainCount === 1 && textLen < MIN_MAIN_TEXT) {
    fail(file, `only ${textLen} chars of text inside <main> (floor ${MIN_MAIN_TEXT}) — content may have been gutted`);
  }
}

// --- sitemap reconciliation, both directions
/* sitemap.xml is a <sitemapindex>, so the page URLs live one level down in the
   per-section children it names. Walk the index to collect them, and check that
   every child it advertises actually exists — an index pointing at a missing
   sitemap fails silently in Search Console. */
const sitemapPath = path.join(ROOT, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  fail('sitemap.xml', 'missing');
} else {
  const indexXml = fs.readFileSync(sitemapPath, 'utf8');
  if (!/<sitemapindex\b/.test(indexXml)) fail('sitemap.xml', 'expected a <sitemapindex> (run: node build_sitemap.cjs)');

  const children = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x => x[1].replace(/^https?:\/\/[^/]+\//, ''));
  if (!children.length) fail('sitemap.xml', 'index names no child sitemaps');

  const locs = [];
  for (const child of children) {
    const childPath = path.join(ROOT, child);
    if (!fs.existsSync(childPath)) { fail('sitemap.xml', `index points at ${child}, which does not exist`); continue; }
    const childXml = fs.readFileSync(childPath, 'utf8');
    const childLocs = [...childXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x => x[1]);
    if (!childLocs.length) fail(child, 'contains no <loc> entries');
    locs.push(...childLocs);
  }
  if (!locs.length) fail('sitemap.xml', 'no page URLs found across child sitemaps');

  const mapped = new Set();
  for (const loc of locs) {
    const p = loc.replace(/^https?:\/\/[^/]+/, '');
    const f = p === '/' || p === '' ? 'index.html' : `${p.replace(/^\//, '')}.html`;
    mapped.add(f);
    if (!fs.existsSync(path.join(ROOT, f))) fail('sitemap.xml', `<loc> ${loc} has no file (${f}) — advertising a 404`);
  }
  for (const f of htmlFiles) {
    if (!NOT_IN_SITEMAP.has(f) && !mapped.has(f)) fail('sitemap.xml', `${f} exists but is not listed`);
  }
  const dupes = locs.filter((x, i) => locs.indexOf(x) !== i);
  if (dupes.length) fail('sitemap.xml', `duplicate <loc>: ${[...new Set(dupes)].join(', ')}`);
}

if (failures.length) {
  console.error(`\nintegrity check FAILED — ${failures.length} problem(s):\n`);
  for (const f of failures) console.error('  ' + f);
  console.error('');
  process.exit(1);
}
console.log(`ok: ${htmlFiles.length} html files structurally sound, JSON-LD valid, sitemap reconciled`);
