import express from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = 5055;

// Every route the SPA knows how to render (mirror of parseRoute in src/App.tsx).
// Keep this list in sync with your sitemap. Do NOT prerender /api/* or utility files.
const ROUTES = [
  '/',
  '/calculators',
  '/conception-calculator',
  '/body-type-calculator',
  '/macro-calculator',
  '/bac-calculator',
  '/lifestyle',
  '/fitness',
  '/medical',
  '/about',
  '/contact',
  '/article/art-apob-lipids',
  '/article/art-sleep-circadian',
  '/article/art-ring-dips-mobility',
  '/article/art-symptom-triage-guide',
  '/article/art-metabolic-nutrition-glucose',
  '/article/art-vo2max-zone2-longevity',
];

function assertDistExists() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('[prerender] dist/index.html not found. Run `vite build` first.');
    process.exit(1);
  }
}

function startStaticServer() {
  const app = express();
  app.use(express.static(DIST));
  // SPA fallback so client routing resolves any path to index.html during render.
  app.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')));
  return new Promise((resolve) => {
    const server = app.listen(PORT, () => resolve(server));
  });
}

function outFileForRoute(route) {
  if (route === '/') return path.join(DIST, 'index.html');
  const clean = route.replace(/^\/+|\/+$/g, '');
  return path.join(DIST, clean, 'index.html');
}

async function prerender() {
  assertDistExists();
  const server = await startStaticServer();
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let ok = 0;
  let failed = 0;

  for (const route of ROUTES) {
    const page = await browser.newPage();
    try {
      const url = `http://localhost:${PORT}${route}`;
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });

      // Wait until React has mounted actual content (root is no longer empty)
      // and AutoHeadManager has written a canonical tag.
      await page.waitForFunction(
        () => {
          const root = document.getElementById('root');
          const canonical = document.querySelector('link[rel="canonical"]');
          return root && root.children.length > 0 && !!canonical;
        },
        { timeout: 20000 }
      );

      const html = await page.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML);

      const outFile = outFileForRoute(route);
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, html, 'utf-8');

      const canonical = await page.evaluate(
        () => document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '(none)'
      );
      console.log(`[prerender] OK  ${route.padEnd(42)} canonical=${canonical}`);
      ok++;
    } catch (err) {
      console.error(`[prerender] FAIL ${route} — ${err.message}`);
      failed++;
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();

  console.log(`\n[prerender] done. ${ok} ok, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

prerender().catch((e) => {
  console.error('[prerender] fatal:', e);
  process.exit(1);
});
