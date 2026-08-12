#!/bin/bash
set -e

# ---- 1. Remove the WRONG canonical on body-type-calculator ----
perl -pi -e 's{<link rel="canonical" href="https://www\.raphaatlas\.com/editorial-policy">\s*}{}g' body-type-calculator.html

# ---- 2. Inject a correct self-referencing canonical into every page ----
# Maps filename -> clean URL path
declare -A SLUG=(
  ["index.html"]="/"
  ["calculators.html"]="/calculators"
  ["bac-calculator.html"]="/bac-calculator"
  ["macro-calculator.html"]="/macro-calculator"
  ["body-type-calculator.html"]="/body-type-calculator"
  ["conception-calculator.html"]="/conception-calculator"
  ["fitness.html"]="/fitness"
  ["nutrition.html"]="/nutrition"
  ["health.html"]="/health"
  ["about.html"]="/about"
  ["contact.html"]="/contact"
  ["medical-review-board.html"]="/medical-review-board"
  ["editorial-policy.html"]="/editorial-policy"
  ["privacy.html"]="/privacy"
)

for f in "${!SLUG[@]}"; do
  [ -f "$f" ] || continue
  url="https://www.raphaatlas.com${SLUG[$f]}"

  # strip any existing canonical so we never double up
  perl -pi -e 's{<link[^>]*rel="canonical"[^>]*>\s*}{}g' "$f"

  # insert canonical + robots directive right after </title>
  perl -pi -e "s{</title>}{</title>\n<link rel=\"canonical\" href=\"$url\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large, max-snippet:-1\">}" "$f"
done

# 404 must be noindex, not canonical
perl -pi -e 's{<link[^>]*rel="canonical"[^>]*>\s*}{}g' 404.html
perl -pi -e 's{<meta name="robots"[^>]*>}{<meta name="robots" content="noindex, follow">}' 404.html

# ---- 3. Fix the www redirect so it covers ALL paths, not just / ----
python3 - <<'PY'
import json
v = json.load(open('vercel.json'))
v['redirects'] = [{
    "source": "/:path*",
    "has": [{"type": "host", "value": "raphaatlas.com"}],
    "destination": "https://www.raphaatlas.com/:path*",
    "permanent": True
}]
json.dump(v, open('vercel.json','w'), indent=2)
PY

echo "Done. Verify with: grep -H canonical *.html"
