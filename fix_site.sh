#!/bin/bash

# 1. Flatten directories to .html files
for dir in nutrition fitness/sample-article fitness body-type-calculator conception-calculator bac-calculator health macro-calculator calculators about contact medical-review-board editorial-policy privacy; do
  if [ -f "$dir/index.html" ]; then
    # Create flattened name. e.g., fitness/sample-article -> fitness-sample-article.html
    # But wait, fitness/sample-article should probably be fitness/sample-article.html
    # Let's just move it to dir.html
    # For nested like fitness/sample-article, it becomes fitness/sample-article.html
    dest="${dir}.html"
    mv "$dir/index.html" "$dest"
    rm -rf "$dir"
  fi
done

# 2. Update all links in all HTML files
# Replace href="/dir/" with href="/dir"
# We use perl for reliable regex replacement across files
find . -name "*.html" -exec perl -pi -e 's/href="\/([a-zA-Z0-9-]+)\/"/href="\/\1"/g' {} +
find . -name "*.html" -exec perl -pi -e 's/href="\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/"/href="\/\1\/\2"/g' {} +

# 3. Fix robots.txt
cat << 'ROBOTS' > robots.txt
User-agent: *
Allow: /
Sitemap: https://www.raphaatlas.com/sitemap.xml
ROBOTS

# 4. Fix sitemap.xml
cat << 'SITEMAP' > sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.raphaatlas.com/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.raphaatlas.com/calculators</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.raphaatlas.com/body-type-calculator</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.raphaatlas.com/macro-calculator</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.raphaatlas.com/bac-calculator</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.raphaatlas.com/conception-calculator</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.raphaatlas.com/fitness</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.raphaatlas.com/nutrition</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.raphaatlas.com/health</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.raphaatlas.com/about</loc><changefreq>yearly</changefreq><priority>0.5</priority></url>
  <url><loc>https://www.raphaatlas.com/contact</loc><changefreq>yearly</changefreq><priority>0.4</priority></url>
  <url><loc>https://www.raphaatlas.com/medical-review-board</loc><changefreq>yearly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.raphaatlas.com/editorial-policy</loc><changefreq>yearly</changefreq><priority>0.5</priority></url>
  <url><loc>https://www.raphaatlas.com/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>
SITEMAP

# 5. Remove README.md to prevent hosts from serving it as the index
rm -f README.md

# 6. Update vercel.json
cat << 'VERCEL' > vercel.json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "trailingSlash": false,
  "redirects": [
    { "source": "/", "has": [{ "type": "host", "value": "raphaatlas.com" }], "destination": "https://www.raphaatlas.com/", "permanent": true }
  ],
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
    ]}
  ]
}
VERCEL

