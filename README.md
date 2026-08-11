# RaphaAtlas — Deploy Instructions (read this first)

## The one rule that fixes everything
Every file here is **plain static HTML/CSS**. There is **NO build step**. Vercel must
serve these files exactly as they are. The reason your homepage was broken is that a
Markdown file with `---` front-matter was being served raw. None of these files contain
front-matter. Do not let any tool add it back.

## Exact repo structure (must match)
```
/
├── index.html
├── styles.css
├── 404.html
├── robots.txt
├── sitemap.xml
├── vercel.json
├── calculators/index.html
├── body-type-calculator/index.html
├── macro-calculator/index.html
├── bac-calculator/index.html
├── conception-calculator/index.html
├── fitness/index.html
├── fitness/sample-article/index.html
├── nutrition/index.html
└── health/index.html
```

## Put your real calculators in
Open each of the four calculator files, e.g. `body-type-calculator/index.html`. Find:
```
<!-- >>> CALCULATOR START <<< -->
...
<!-- >>> CALCULATOR END <<< -->
```
Replace everything between those markers with your existing calculator's HTML +
inline `<script>`. Keep the surrounding page (header, footer, disclaimer, schema) intact.

## Publishing articles (this scales to thousands)
Copy `fitness/sample-article/` to `fitness/your-slug/` and edit the content. Same for
`nutrition/your-slug/` and `health/your-slug/`. Each article is one folder with one
`index.html`. Add each new URL to `sitemap.xml`.

## Vercel settings (check these once, in the dashboard)
- Framework Preset: **Other**
- Build Command: **empty** (leave blank)
- Output Directory: **leave as root** (`.` or blank)
- Install Command: **empty**

If a framework preset is set, Vercel may run a build that breaks these static files.

## Domain
Pick ONE canonical host. These files assume **www.raphaatlas.com**. In Vercel, set
`www` as primary and let `raphaatlas.com` redirect to it (vercel.json also enforces this).

## After deploy — verify
Visit each URL and confirm it renders (not raw text):
- https://www.raphaatlas.com/
- https://www.raphaatlas.com/body-type-calculator/
- https://www.raphaatlas.com/macro-calculator/
- https://www.raphaatlas.com/bac-calculator/
- https://www.raphaatlas.com/conception-calculator/
Then in Google Search Console: submit `sitemap.xml` and request indexing for the homepage.

## Still missing (build these next, they matter for a health/YMYL site)
`/about/`, `/editorial-policy/`, `/medical-review-board/`, `/contact/`,
`/privacy/`. The footer already links to them — they will 404 until you create them.
Google demimes trust for health sites without visible authorship and review.
