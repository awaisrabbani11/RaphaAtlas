# RaphaAtlas Deindexing Forensics — Diagnostic Report

**Prepared:** 2026-09-13
**Scope:** Forensic investigation of the 2026-08-28/29 Google deindexing event.
**Method:** Git history reconstruction, spec-compliant HTML parsing (parse5) of three
point-in-time snapshots, sitemap reconciliation, and live HTTP response checks.
**Changes made to site content, copy, or design:** none. No `.cjs` script was executed.

---

## 1. VERDICT

**No. A bad deploy did not break the site.** The HTML is structurally sound and was
structurally sound throughout the incident window.

The leading hypothesis — that a broken `<head>` was deployed site-wide around Aug 26–28 by
one of the three regex-surgery scripts — is **disproven**. There *was* a site-wide HTML
change deployed in that window (`0a8d065`, 2026-08-26 20:25, 15 HTML files), but it was a
Tailwind theme-token and font-loading refactor. I parsed the exact tree that was live on
Aug 29 with parse5 (the same spec-compliant parser Chrome and Googlebot use) and every one
of the 15 files produced **zero parse errors, exactly one `<html>/<head>/<body>/<title>`,
balanced `<script>` tags, valid JSON-LD, and no zero-width or non-ASCII characters in any
tag or attribute name**. The live site today is byte-identical to the repo and equally clean.

The cause is not structural. It is a **site-level content-quality evaluation**, and the
evidence for it is quantitative. After subtracting the 513 characters of navigation and
footer boilerplate present on every page, this is what Google actually fetched on Aug 29:

| URL | Unique body text on Aug 29 |
|---|---|
| `/health` | **430 chars** |
| `/privacy` | 676 chars |
| `/medical-review-board` | 726 chars |
| `/editorial-policy` | 878 chars |
| `/calculators` | 884 chars |
| `/contact` | 1,112 chars |
| `/nutrition` | 1,131 chars |
| `/fitness` | 1,193 chars |
| `/about` | 1,373 chars |

Nine of the thirteen indexable URLs carried under 1,400 characters of unique content on a
**YMYL health site**. `Crawled — currently not indexed` is precisely Google's bucket for a
URL it fetched successfully, parsed without difficulty, and then declined to index on
merit. All twelve affected URLs entering that single bucket on one day, while crawling
continued normally and no manual action was issued, is the signature of a site-level
quality judgement rather than a technical fault.

**Critically, the Aug 26 deploy did not cause the thinness.** The unique-content figures for
those pages are *identical, character for character*, between the Aug 14 snapshot (when the
site was indexed and serving ~117 impressions/day) and the Aug 26 snapshot. The deploy
changed styling, not substance. The thin content had been there since launch; Google simply
finished evaluating a ~2-month-old domain and acted. The Aug 26 deploy is a coincidence of
timing, not a cause.

**One meaningful correction to the incident framing:** the remediation has substantially
already happened. The Aug 30 deploy (`9698288`) added real content to the hub pages —
`/health` went from 430 to 9,952 unique characters, `/nutrition` 1,131 → 10,576, `/fitness`
1,193 → 9,223, `/editorial-policy` 878 → 7,503. Those pages are no longer thin. Three pages
remain thin today and are listed in the fix list below.

**Confidence:** High that the structural hypothesis is dead — that is directly measured, not
inferred. Moderate-to-high on the quality-evaluation diagnosis: it is the only explanation
consistent with every observed fact (single bucket, one day, all non-home URLs, crawling
continues, no manual action, HTML valid, all URLs 200), but Google does not publish the
input to that decision, so it remains an inference from strong circumstantial evidence.

---

## 2. Phase 1 — Git Forensics

### 2.1 Every commit in the window (2026-08-20 → 2026-09-06)

| Commit | Date (ISO) | Message | Files | Ins/Del | HTML files touched |
|---|---|---|---|---|---|
| `0a8d065` | 2026-08-26 20:25:48 +0500 | changes of UI and bugs | 18 | +1129 / −393 | **15** |
| `f723d63` | 2026-08-26 20:46:00 +0500 | add images | 4 | +168 / −0 | 4 |
| `8bb546a` | 2026-08-30 18:25:59 +0500 | design improved | 17 | +11525 / −300 | **15** |
| `9698288` | 2026-08-30 19:05:00 +0500 | push | 20 | +1659 / −225 | **17** |
| `bfddbd8` | 2026-08-31 20:41:59 +0500 | BAC Cal optimization | 4 | +141 / −68 | 1 |
| `ec531c5` | 2026-08-31 21:58:34 +0500 | commit changes | 26 | +1206 / −1020 | **15** |
| `3f2a62a` | 2026-08-31 22:32:30 +0500 | commit changes | 3 | +54 / −35 | 2 |

Nearest commits outside the window for context: `11485d1` (2026-08-14, the last state before
the window) and `f8daae8` (2026-09-07 00:20, current `HEAD`).

### 2.2 Commits touching more than 5 HTML files at once

Four: `0a8d065`, `8bb546a`, `9698288`, `ec531c5`.

Of these, **only `0a8d065` and `f723d63` were deployed before the Aug 29 deindexing.**
`8bb546a`, `9698288`, `ec531c5` and `3f2a62a` all landed on Aug 30–31, *after* the event,
and therefore cannot be causal.

Regarding the three regex-surgery scripts: `0a8d065` did not modify any of them.
`update_header_footer.cjs` was heavily rewritten in `8bb546a` (+842 lines) and
`unify_layout.cjs` in `ec531c5` — both post-incident. There is no evidence in the commit
record that `seo_fix.cjs`, `unify_layout.cjs`, or `update_header_footer.cjs` ran against the
tree between Aug 25 and Aug 29.

### 2.3 Largest such commit before the incident — `0a8d065`, structural `<head>` changes

`git diff 0a8d065^ 0a8d065 -- '*.html'` shows a consistent, mechanical refactor applied to
all 15 files. What structurally changed in the `<head>`:

- **Font loading consolidated.** Four separate `fonts.googleapis.com` stylesheet links
  (Inter, Montserrat, Material Symbols, Merriweather, Archivo — requested in several
  overlapping calls) were replaced by a single combined request, with `preconnect` hints
  hoisted above it. Net effect: fewer render-blocking requests. A correct optimisation.
- **Tailwind config expanded.** The inline `tailwind.config` object in the Play-CDN
  `<script>` gained `spacing`, `maxWidth`, `fontFamily`, `fontSize` and six additional
  surface colour tokens. Pure addition inside an existing, properly closed `<script>`.
- **Whitespace normalisation.** `<meta name="description">` and `<meta name="robots">` lines
  lost their leading indentation. Cosmetic only — these show as paired `-`/`+` lines in the
  diff and are the reason a naive grep appears to show a `robots` directive being
  "introduced."
- **JSON-LD expanded, not deleted.** The `@graph` gained an `ItemList` node enumerating the
  four calculators. The `Organization` and `WebSite` nodes were preserved intact. Contrary
  to the known-risk note, **no JSON-LD was lost in this commit.**
- **Footer:** an `img` gained an explicit `width="144"` (a CLS fix), and a copyright line's
  opacity went `30` → `50`.

**Nothing in this diff is capable of deindexing a site.** No `noindex` was added, no
canonical altered, no content removed, no tag left unbalanced.

### 2.4 `noindex` audit

A `<meta name="robots" content="noindex, follow">` does exist in the tree — in **`404.html`
only**, both at `0a8d065` and in current `HEAD`. That is correct and intentional. No other
file in any snapshot carries a `noindex`. `robots.txt` was `Allow: /` throughout and is
unchanged between Aug 26 and today.

### 2.5 Plain statement

> **Was there a site-wide HTML change deployed between Aug 25 and Aug 29?**
>
> **Yes — commit `0a8d065` (2026-08-26 20:25:48 +0500), touching 15 HTML files**, followed
> 21 minutes later by `f723d63` touching 4 more.
>
> **Did it break anything? No.** Both commits left every file structurally valid, with
> intact `<head>`, intact JSON-LD, and unchanged body content. The deployed state on Aug 29
> parses cleanly with zero errors.

---

## 3. Phase 2 — HTML Integrity Audit

Parser: **parse5 5.x** (spec-compliant HTML5, already present in `node_modules`), with
`onParseError` capture enabled. Checks (b), (c), (e) additionally verified by raw-byte tag
counting so that parser error-recovery cannot mask an imbalance. Nothing was eyeballed.

> **Note on the prescribed `grep -P` check (d).** The bundled Git-Bash `grep` on this
> machine is built without Unicode `\x{...}` support and fails with
> `character value in \x{} or \o{} is too large` — it exits 2 and matches nothing. Run as
> specified it produces a **false all-clear**. The scan was reimplemented in Node over
> decoded UTF-8, testing U+200B, U+200C, U+200D, U+FEFF and U+00A0, and additionally
> classifying each hit by whether it falls inside a tag (between an unclosed `<` and its
> `>`), which is the position that would actually break parsing.

### 3.1 Current `HEAD` (= live production, verified identical)

| File | (a) parses | (b) html/head/body | (c) title | (d) bad chars (in-tag) | (e) script o/c | (f) JSON-LD | (g) body text |
|---|---|---|---|---|---|---|---|
| `404.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 27ch | 0 (0) | 2/2 | 0 blocks | 1,193 |
| `about.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 29ch | 0 (0) | 3/3 | 1 valid | 2,416 |
| `bac-calculator.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 27ch | 0 (0) | 5/5 | 3 valid | 32,562 |
| `body-type-calculator.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 58ch | 0 (0) | 4/4 | 1 valid | 97,584 |
| `calculators.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 53ch | 0 (0) | 3/3 | 2 valid | 7,703 |
| `conception-calculator.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 34ch | 0 (0) | 5/5 | 3 valid | 28,349 |
| `contact.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 53ch | 0 (0) | 2/2 | 1 valid | 5,389 |
| `editorial-policy.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 65ch | 0 (0) | 3/3 | 1 valid | 8,623 |
| `fitness.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 60ch | 0 (0) | 4/4 | 3 valid | 10,343 |
| `health.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 61ch | 0 (0) | 5/5 | 3 valid | 11,072 |
| `index.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 49ch | 0 (0) | 3/3 | 1 valid | 4,933 |
| `lifestyle.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 62ch | 0 (0) | 5/5 | 3 valid | 15,178 |
| `macro-calculator.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 29ch | 0 (0) | 5/5 | 3 valid | 33,203 |
| `medical-review-board.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 33ch | 0 (0) | 3/3 | 1 valid | 1,769 |
| `nutrition.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 65ch | 0 (0) | 4/4 | 3 valid | 11,696 |
| `privacy.html` | ok, 0 errors | 1/1, 1/1, 1/1 | 1, 27ch | 0 (0) | 3/3 | 1 valid | 1,719 |

**Totals: 16/16 files valid. 0 parse errors. 0 malformed JSON-LD blocks (33 blocks parsed).
0 zero-width or non-ASCII characters anywhere, let alone in tag or attribute names. 0 files
under the 500-character body-text floor.**

### 3.2 The Aug 26 snapshot — the state that was live when Google deindexed

Same audit against `git archive f723d63`:

**15/15 files valid. 0 parse errors. 0 bad characters. 0 malformed JSON-LD. All tags
balanced.** The only file below 500 characters of *unique* text was `404.html` (150), which
is `noindex` and irrelevant.

Body-text totals on Aug 29: `404` 663, `health` 943, `privacy` 1,189,
`medical-review-board` 1,239, `editorial-policy` 1,391, `calculators` 1,397, `contact`
1,625, `nutrition` 1,644, `fitness` 1,706, `about` 1,886, `index` 4,403, `conception`
27,819, `bac` 32,032, `macro` 32,646, `body-type` 95,992.

### 3.3 Boilerplate ratio — the number that matters

Longest-common-prefix/suffix analysis across all pages isolates the shared navigation and
footer chrome:

| Snapshot | Nav+footer boilerplate on every page |
|---|---|
| Aug 14 | 513 chars |
| Aug 26 (live at deindexing) | 513 chars |
| Sep 13 (now) | 1,120 chars |

Subtracting it produces the unique-content table in §1. Note that the site navigation is
emitted **twice** into the DOM on every page (a desktop `<nav>` and a mobile `<nav>`, both
present rather than one being CSS-toggled), which is what inflates the shared prefix to
~480 characters. Harmless on a 30,000-character calculator page; on the 943-character
`/health` page as it stood on Aug 29, chrome outnumbered content.

### 3.4 Aug 14 vs Aug 26 — the exoneration

| Page | Unique text Aug 14 | Unique text Aug 26 | Δ |
|---|---|---|---|
| `health` | 430 | 430 | 0 |
| `privacy` | 676 | 676 | 0 |
| `medical-review-board` | 726 | 726 | 0 |
| `editorial-policy` | 878 | 878 | 0 |
| `calculators` | 884 | 884 | 0 |
| `contact` | 1,112 | 1,112 | 0 |
| `nutrition` | 1,131 | 1,131 | 0 |
| `fitness` | 1,193 | 1,193 | 0 |
| `about` | 1,373 | 1,373 | 0 |
| `index` | 966 | 3,890 | **+2,924** |
| calculators (4) | 27,114 – 95,319 | 27,306 – 95,479 | +192 – +160 |

The Aug 26 deploy **removed nothing**. It added content to the homepage. Every other page's
content is unchanged from the period when the site was indexed and ranking.

---

## 4. Phase 3 — Sitemap Reconciliation

### 4.1 All `<loc>` values and file resolution (`cleanUrls: true`)

All 15 entries resolve to a real file in the repo root. **Zero missing files, zero
advertised 404s.**

| `<loc>` | Maps to | Exists |
|---|---|---|
| `/` | `index.html` | yes |
| `/calculators` | `calculators.html` | yes |
| `/macro-calculator` | `macro-calculator.html` | yes |
| `/bac-calculator` | `bac-calculator.html` | yes |
| `/body-type-calculator` | `body-type-calculator.html` | yes |
| `/conception-calculator` | `conception-calculator.html` | yes |
| `/health` | `health.html` | yes |
| `/nutrition` | `nutrition.html` | yes |
| `/fitness` | `fitness.html` | yes |
| `/lifestyle` | `lifestyle.html` | yes |
| `/editorial-policy` | `editorial-policy.html` | yes |
| `/medical-review-board` | `medical-review-board.html` | yes |
| `/about` | `about.html` | yes |
| `/contact` | `contact.html` | yes |
| `/privacy` | `privacy.html` | yes |

### 4.2 `/fitness` and `/lifestyle` specifically

Both exist and both return HTTP 200.

- **`fitness.html`** — exists, 51,231 bytes, 10,343 chars of body text, valid HTML,
  3 JSON-LD blocks. It has been in the sitemap since Aug 12. **Not a 404.**
- **`lifestyle.html`** — exists, 54,265 bytes, 15,178 chars of body text, valid HTML,
  3 JSON-LD blocks. **It did not exist on Aug 29** — it was created in commit `9698288`
  on 2026-08-30 19:05, the day after the deindexing, and added to the sitemap in the same
  commit. **Not a 404.**

  Incidental note: `lifestyle.html` is the one page that does not load `/tailwind.css`. This
  is **not a defect** — it is a self-contained page carrying its own 14.8 KB inline
  stylesheet and a private `rah-*` class namespace, using zero Tailwind utility classes. It
  renders correctly. Flagging it only because a naive stylesheet-link audit will keep
  reporting it.

### 4.3 Cross-check against the 12 GSC-confirmed URLs

GSC list (12): `/contact` `/health` `/calculators` `/editorial-policy` `/nutrition`
`/conception-calculator` `/body-type-calculator` `/about` `/medical-review-board`
`/privacy` `/bac-calculator` `/macro-calculator`

**In GSC but not in the sitemap: none.** All 12 are present in both the current sitemap and
the Aug 26 sitemap.

**In the current sitemap but not in GSC's 12: three —** `/` , `/fitness`, `/lifestyle`.

This reconciles exactly, and the arithmetic is worth stating because it confirms the GSC
report is internally consistent:

- The sitemap live on Aug 29 contained **14** URLs (`/lifestyle` did not yet exist).
- Minus `/` (the homepage, which GSC confirms stayed indexed) → **13**.
- Minus `/fitness` → **12**, matching GSC exactly.

So `/fitness` is the single anomaly: it was in the sitemap, it existed, it returned 200, and
yet it is *not* in the "Crawled — currently not indexed" bucket. The most likely explanation
is that it sits in a different bucket — `Discovered — currently not indexed` (crawled less
recently, so not re-evaluated in the Aug 29 pass) — rather than having been treated
differently on merit. **This is worth confirming directly in GSC**, because if `/fitness` is
in `Discovered — currently not indexed` it indicates a crawl-scheduling issue layered on top
of the quality issue. `/lifestyle` is simply too new to have been evaluated on Aug 29.

### 4.4 `<lastmod>` discrepancy — resolved

**The sitemap is hand-maintained. There is no second generator.**

`seo_fix.cjs` is the only file in the repository that writes `sitemap.xml`
(`seo_fix.cjs:290–299`). It regenerates the file wholesale and stamps
`new Date().toISOString().slice(0,10)` — today's date — into **every** entry
(`seo_fix.cjs:291,295`). A run of that script would therefore leave 15 identical `lastmod`
values. It could not produce the mixed `2026-08-30` / `2026-08-12` state now in the file.

The git history explains the mix precisely. `sitemap.xml` has five commits; the two relevant
ones:

- **`fa156a1` (2026-08-12)** — the last time `seo_fix.cjs` was actually run. It stamped
  `2026-08-12` uniformly across all 14 entries.
- **`9698288` (2026-08-30)** — a **manual edit**, not a script run. The diff shows selective,
  human-shaped changes: `/lifestyle` inserted as a new entry; the entry block reordered
  (`fitness`/`nutrition`/`health` → `health`/`nutrition`/`fitness`); priorities
  individually retuned (hubs `0.6` → `0.8`, `editorial-policy`/`medical-review-board`
  `0.6` → `0.7`, `privacy` `0.6` → `0.3`); and `lastmod` bumped to `2026-08-30` on exactly
  the nine entries that were touched, leaving `macro-calculator`, `bac-calculator`,
  `body-type-calculator`, `conception-calculator`, `medical-review-board`, `about` and
  `privacy` at their stale `2026-08-12`.

A script cannot produce a partial, semantically-targeted edit like that. The conclusion is
that `seo_fix.cjs` has not run since 2026-08-12, and the sitemap has been maintained by hand
since. **Practical consequence: five `lastmod` values are now wrong.** `about.html`,
`privacy.html`, `medical-review-board.html`, `macro-calculator.html` and
`bac-calculator.html` have all been modified since Aug 12 but still advertise
`lastmod` `2026-08-12`, which actively discourages Google from recrawling exactly the pages
you most need re-evaluated.

---

## 5. Phase 4 — Live Response Check

All 15 sitemap URLs, followed through redirects:

| Status | Content-Type | Bytes | URL |
|---|---|---|---|
| 200 | `text/html; charset=utf-8` | 63,295 | `https://www.raphaatlas.com/` |
| 200 | `text/html; charset=utf-8` | 49,289 | `/calculators` |
| 200 | `text/html; charset=utf-8` | 114,852 | `/macro-calculator` |
| 200 | `text/html; charset=utf-8` | 93,308 | `/bac-calculator` |
| 200 | `text/html; charset=utf-8` | 186,971 | `/body-type-calculator` |
| 200 | `text/html; charset=utf-8` | 105,975 | `/conception-calculator` |
| 200 | `text/html; charset=utf-8` | 51,459 | `/health` |
| 200 | `text/html; charset=utf-8` | 53,359 | `/nutrition` |
| 200 | `text/html; charset=utf-8` | 51,231 | `/fitness` |
| 200 | `text/html; charset=utf-8` | 54,265 | `/lifestyle` |
| 200 | `text/html; charset=utf-8` | 44,009 | `/editorial-policy` |
| 200 | `text/html; charset=utf-8` | 35,863 | `/medical-review-board` |
| 200 | `text/html; charset=utf-8` | 42,968 | `/about` |
| 200 | `text/html; charset=utf-8` | 48,267 | `/contact` |
| 200 | `text/html; charset=utf-8` | 35,761 | `/privacy` |

**Flags: none.** All 15 return 200. **Zero redirects** (`num_redirects` = 0 on every URL —
the canonical host is being requested directly and no chain is introduced). **Zero responses
under 10 KB** — the smallest is 35,761 bytes.

### 5.1 `sitemap.xml`

```
HTTP/1.1 200 OK
Content-Type: application/xml; charset=utf-8
Content-Length: 1853
Cache-Control: public, max-age=0, must-revalidate
Last-Modified: Sun, 13 Sep 2026 16:24:09 GMT
Server: Vercel
X-Vercel-Cache: HIT
```

Status **200**, Content-Type **`application/xml; charset=utf-8`** — correct, and confirms the
`vercel.json` header override is being applied. `robots.txt` likewise returns 200.

### 5.2 Deploy integrity

Every page was re-fetched with a Googlebot user-agent and diffed against the working tree.
**All 15 files are identical to repo `HEAD` (`f8daae8`)** ignoring line-ending normalisation
(the working tree is CRLF, Vercel serves LF — this fully accounts for the small byte deltas
between local file sizes and `size_download`). Re-running the parse5 audit against the
*live-fetched* bytes reproduces §3.1 exactly: 15/15 valid, 0 parse errors, 0 bad characters,
all JSON-LD valid.

**There is no drift between the repository and production, and what Googlebot receives is
well-formed HTML with all content present in the initial server response — no JavaScript
execution is required to see it.**

### 5.3 Other live checks

- **Canonicals:** all 15 indexable pages carry a correct self-referencing canonical on the
  `www` host. `404.html` has none, which is fine for a `noindex` page.
- **Meta descriptions:** all 16 are unique. No duplication.
- **Hotlinked images:** 14 `<img src>` references point at third-party hosts
  (`i.pinimg.com` × 13, plus `lh3.googleusercontent.com` AI-generated placeholders in the
  Aug 26 snapshot). Spot-checked with a `raphaatlas.com` referer — they currently return
  200, so they are **not** broken today. They remain a standing risk (see fix list).

---

## 6. Ranked Fix List

Ordered by expected impact on re-indexing. **Nothing below has been implemented** — awaiting
your approval.

### Tier 1 — Directly addresses the diagnosed cause

| # | Fix | Why | Effort |
|---|---|---|---|
| 1 | **Remove the live placeholder in `privacy.html:711`** — the page currently ships the literal sentence *"Replace this section with your actual analytics and cookie details."* | Unfinished template copy in production is an unambiguous low-quality signal, and it sits on a YMYL trust page. This is the single most damaging line on the site relative to its size. | **5 min** |
| 2 | **Expand `medical-review-board.html`** from 649 unique chars. Give each physician a real bio, credentials, scope of review, and a named review process. | This page carries the entire E-E-A-T claim of a YMYL health site and is currently two sentences and two one-line entries. Google's quality systems weight this page category heavily for health content. | **90 min** |
| 3 | **Fix `about.html` copy.** It opens with a broken, ungrammatical run-on containing the typo *"nutriton"*: *"Rapha means: health and Atlas: a complete guide of, it covers nutriton, health, calculators, fitness and is a complete guide of…"* (duplicated clause). | Visibly unedited prose on the About page, again on a YMYL site. Cheap to fix, disproportionately bad to leave. | **20 min** |
| 4 | **Expand `privacy.html`** from 599 unique chars to a real policy (data handling, analytics vendor, cookies, retention, contact, jurisdiction). | Thin + placeholder-bearing. Also a legal exposure independent of SEO. | **45 min** |
| 5 | **Add `author` / `reviewedBy` / `datePublished` / `dateModified`** to every content page, in both visible bylines and JSON-LD. Currently only `body-type-calculator.html` has `author` markup; 14 of 16 pages have none, and most have no dates at all. | Standard, expected E-E-A-T signalling for YMYL. Its absence across the site is conspicuous. | **60 min** |
| 6 | **Add `Person` schema** for the two physicians on `medical-review-board.html`, and `AboutPage` / `Organization` on `about.html`. Those pages currently carry only `BreadcrumbList`. | Makes the authorship claim machine-readable rather than prose-only. Pairs with #2 and #5. | **30 min** |

### Tier 2 — Recovery mechanics

| # | Fix | Why | Effort |
|---|---|---|---|
| 7 | **Correct the five stale `lastmod` values** (`about`, `privacy`, `medical-review-board`, `macro-calculator`, `bac-calculator` — all modified since but still claiming `2026-08-12`), then keep the sitemap hand-maintained. | Stale `lastmod` suppresses recrawl of exactly the pages you are about to fix. Do this *after* Tier 1 lands so the new dates are truthful. | **10 min** |
| 8 | **Confirm `/fitness`'s actual GSC bucket.** It is the one sitemap URL absent from the 12; if it reads `Discovered — currently not indexed` there is a crawl-scheduling issue to address separately. | Closes the last unexplained gap in the GSC picture. Diagnostic, not a code change. | **10 min** |
| 9 | **After Tier 1 deploys, use GSC URL Inspection → Request Indexing** on the homepage and the repaired hub pages, and resubmit `sitemap.xml`. | Recovery from `Crawled — currently not indexed` is not automatic on a low-authority 2-month-old domain; it needs an explicit nudge plus a genuine content delta to justify re-evaluation. Expect weeks, not days. | **20 min** |

### Tier 3 — Durable risk reduction

| # | Fix | Why | Effort |
|---|---|---|---|
| 10 | **Self-host the 14 hotlinked `i.pinimg.com` images** into `assets/img/`. | They work today but are third-party-controlled, can be revoked or hotlink-blocked without warning, and using Pinterest-hosted imagery on a commercial YMYL site carries a licensing question independent of SEO. | **45 min** |
| 11 | **Retire or guard `seo_fix.cjs`, `unify_layout.cjs`, `update_header_footer.cjs`.** They are exonerated for *this* incident, but `seo_fix.cjs` would silently flatten all 15 `lastmod` values to today's date if run, destroying the hand-maintained state described in §4.4. | Removes a live footgun. At minimum add a refusal guard; better, delete the sitemap-writing block now that the file is maintained by hand. | **30 min** |
| 12 | **Add a pre-commit integrity check.** The parse5 audit used for this report (tag balance, single `<head>`/`<title>`, JSON-LD validity, zero-width characters, body-text floor) runs over all 16 files in about a second. | The structural-corruption fear driving this investigation was unfounded *this time*. A cheap gate makes it permanently checkable instead of a recurring worry. Note the `grep -P` caveat in §3 — the check must be the Node version, not the shell one. | **30 min** |
| 13 | **Consider CSS-toggling one of the two navigations** so the nav is emitted once rather than twice. | Cuts ~480 chars of duplicated boilerplate from every page. Marginal now that the hubs carry real content; it mattered when `/health` was 943 chars total. **Touches markup/design — explicitly out of scope for this task; listed for completeness only.** | **45 min** |

---

## 7. What This Report Rules Out

For the record, each of these was tested rather than assumed, and each is **negative**:

- Broken or duplicated `<head>` — 0 occurrences across three snapshots and the live site.
- Orphaned or unclosed `<script>` blocks — every file balanced, raw-count and DOM-count agree.
- Deleted or malformed JSON-LD — 33 blocks parsed across 16 files, all valid; the Aug 26
  commit *added* JSON-LD.
- Zero-width / non-ASCII characters in tag or attribute names — 0, verified in Node after
  the prescribed `grep -P` was found non-functional on this machine.
- `noindex` leakage — confined to `404.html`, correctly.
- `robots.txt` blocking — `Allow: /` throughout, unchanged since before the incident.
- Canonical errors — all self-referencing and correct.
- Redirect chains — 0 redirects on all 15 URLs.
- Soft 404s / missing files — all 15 sitemap URLs resolve to real files and return 200 with
  35 KB+ payloads.
- Sitemap advertising non-existent pages — including `/fitness` and `/lifestyle`, both of
  which exist.
- Repo-to-production drift — all 15 live pages byte-identical to `HEAD`.
- JS-dependent content — full text present in the raw server response; no rendering required.

**The code is not the problem. The content was.**

---

## 8. Remediation Log — Tier 1 (applied 2026-09-13)

Eight files changed, +218 / −79 lines. All 16 HTML files re-audited after every edit: **16/16 parse
clean, 0 parse errors, 31/31 JSON-LD blocks valid, 0 bad characters.** Rendering verified in a
local browser; no console errors. Nothing is deployed yet — these are working-tree changes.

### Content restored

| Page | Unique text before | After | Change |
|---|---|---|---|
| `medical-review-board.html` | 649 | 5,373 | **+4,724** |
| `privacy.html` | 599 | 5,245 | **+4,646** |
| `about.html` | 1,296 | 2,336 | +1,040 |
| `contact.html` | 4,269 | 4,978 | +709 |
| 4 calculators (bylines) | — | — | +88 to +123 each |

**No page on the site now sits below 1,700 unique characters.** The three pages that were still
thin after the Aug 30 recovery are no longer thin.

### What was fixed

1. **Live placeholder removed** — `privacy.html` was shipping the literal sentence *"Replace this
   section with your actual analytics and cookie details."* Replaced with a full policy.
2. **Privacy policy rewritten from verified facts.** Before writing it I audited the codebase for
   what actually runs: **zero external scripts, zero analytics, zero trackers, zero cookies, zero
   localStorage/sessionStorage/IndexedDB.** The policy now states that truthfully rather than
   guessing, and discloses the two genuine third-party exposures (Google Fonts, Pinterest image
   hotlinks) plus Vercel's request logging. Sections added: what we collect, client-side
   calculators, host logs, third parties, affiliates, email, children, GDPR rights, change policy.
3. **Fabricated credentials removed.** `about.html` displayed **"NSCA-CPT", "Precision Nutrition"
   and "FMS L2"** under a heading reading *"Trusted & Certified"* — directly above an HTML comment
   in the source reading `<!-- Imaginary Cert Logos -->`. Three fabricated professional
   certifications presented as trust signals on a YMYL health site. Replaced with a factual
   "How we work" section (physician review, auditable calculators, independence).
4. **`about.html` converted from personal-trainer template to publisher voice.** Removed the
   broken opening sentence (*"Rapha means: health and Atlas: a complete guide of, it covers
   nutriton…"*, including the typo), and the first-person copy — *"My Mission & Method"*, *"My goal
   is to provide"*, *"I prioritize compound movements"* — that contradicted `editorial-policy.html`.
   Removed the unsubstantiated **"10+ Years Exploring Biomechanics"** stat.
5. **Invisible h1 text fixed.** `about.html`'s `<h1>` contained
   `<span style="…color: white;">RaphaAtlas</span>` rendering white-on-white — measured contrast
   ratio **1:1**, confirmed in-browser via computed style. Half the page's h1 was invisible to
   readers. Beyond the accessibility failure, hidden text is a pattern search engines associate
   with cloaking. Swept the rest of the site for the same defect: no other instances.
6. **Missing `alt` attribute fixed.** The `about.html` hero image carried a `data-alt` attribute
   but **no `alt`** — the only such image on the site. The `data-alt` value was a leftover AI
   image-generation prompt describing *"a fit, smiling man in his mid-30s… holding a kettlebell"*;
   the image actually in use is four runners in motion blur on stone steps. Written from the real
   image.
7. **Dead contact form replaced.** The form had **no `action`, no `method`, no submit handler, and
   no `name` attributes on any input** — pressing "Send Message" silently discarded the message.
   The editorial policy promises corrections within five working days through that page, so the
   site's stated correction channel was non-functional. Replaced with four prefilled `mailto:`
   routes (corrections, calculator support, general, partnerships) plus a scope-limits note.
   Two dead `<button>` elements on `about.html` were likewise converted to real links.
8. **Physician schema added.** `medical-review-board.html` gained an `AboutPage` + two `Person`
   nodes with `hasCredential` (MBBS), `jobTitle`, and stable `@id`s. Built **only from facts
   already stated on the page** — no invented institutions, licence numbers, or years of practice.
9. **Visible bylines added to all four calculators.** These were the only content pages missing
   the byline, despite `styles.css` documenting the convention in a comment: *"the E-E-A-T signal
   Google reads on YMYL pages, so it sits directly under the h1 on every content page."* Each
   byline uses that page's **existing** `lastReviewed` date and reviewer — no review dates were
   invented or refreshed. `datePublished`/`dateModified` added to the three calculators lacking
   them, using real git history dates, and `reviewedBy` normalised to reference the new `Person`
   `@id`s so the graph connects.

10. **`tailwind.css` rebuilt** (`npm run build:css`). The repo ships a **prebuilt, committed**
    `tailwind.css`, so any utility class not already compiled into it is inert. Six classes used
    in the new markup (`leading-snug`, `px-5`, `underline`, `space-y-4`, `hover:text-primary`,
    `hover:text-vitality-teal`) were missing, leaving the new contact cards without padding,
    rounded corners or link underlines. The rebuild added exactly those 8 selectors and removed 14
    belonging to the deleted form and certification block — **verified that none of the 14 removed
    classes are still referenced anywhere in the HTML.** The repo's own `npm run check:css` now
    reports *"ok: no CDN runtime, tailwind.css matches the markup"*.
    One invalid class found and fixed along the way: `rounded-DEFAULT` is not valid Tailwind and
    never generated a rule — it was a pre-existing repo idiom inherited from the old form markup.
    Replaced with `rounded-lg`.
11. **Dead scroll handler removed from `about.html`.** A `window.addEventListener('scroll')`
    handler called `document.getElementById('main-nav').classList` — but **no element with
    `id="main-nav"` exists anywhere on the site**; the header is `#main-header`. It threw an
    uncaught `TypeError` on *every scroll event*, and duplicated scroll styling the `.rah` chrome
    already handles via its own `is-scrolled` class. Pre-existing (present in `HEAD` before this
    session) and confined to `about.html`. Verified gone from the served page.

### Design-detector triage

The design hook reported findings across seven files. To separate what this session introduced
from what predates it, the same detector was run against the pre-edit `HEAD` tree and the results
diffed. Introduced deltas were: `tight-leading` 3→6 on `contact.html`, `all-caps-body` +1 on
`about.html`, and `side-tab` +1/+2 on `privacy.html`/`medical-review-board.html`.

- **`tight-leading`** — fixed. Card titles inherited the `font-label-bold` token's 1.2 line-height;
  added `leading-snug`. Back to the pre-edit baseline of 3.
- **`all-caps-body`** — fixed. The replacement stat label was a longer all-caps run than the
  original; shortened to "Health content reviewed" (23 chars vs the original 28).
- **`side-tab`** — **suppressed, narrowly.** `.ra-note` is a pre-existing RaphaAtlas component
  (`styles.css:199`) already used on nine pages including `editorial-policy.html` before this
  session. It was reused verbatim for consistency. Restyling it would mean either deviating from
  site convention on two pages or changing the component across eleven files — a design change
  outside the approved content scope. Ignore persisted per-file (`side-tab=*` scoped to
  `privacy.html` and `medical-review-board.html`) in `.impeccable/config.json`, which already
  carried comparable project-sanctioned entries.

Everything else the hook reported is pre-existing and untouched.

### Still open

- **Physician bios.** The two reviewers still have one-line descriptions. You are sending
  qualifications, institution, specialty, years practising and any registration number you want
  public; these go into both the prose and the `Person` schema. This is the single largest
  remaining E-E-A-T gap.
- **Tier 2 and Tier 3** (§6) — untouched, including the five stale `lastmod` values, which should
  be corrected *after* this work deploys so the new dates are truthful.

---

## 9. Remediation Log — Tier 2 (applied 2026-09-13)

### Item 7 — sitemap `lastmod` corrected ✅

**Correction to §4.4 of this report.** It stated that *five* `lastmod` values were stale. The
correct figure at the time of writing was **seven** — `body-type-calculator` and
`conception-calculator` were also advertising `2026-08-12` despite having been modified on
2026-09-07 and 2026-08-31 respectively, and were omitted from that list. Additionally, six
further entries were off by one day (claiming `2026-08-30` when the underlying files were last
modified `2026-08-31`). After the Tier 1 work, **14 of 15 entries were wrong**.

`sitemap.xml` rewritten with dates derived from actual file modification state — git
last-commit date per file, or today for files changed in this session. Hand-tuned priorities
from the Aug 30 edit preserved exactly; URL order preserved; no entries added or removed.

Verified: 15 URLs, 15 `lastmod`, 15 `priority`; no malformed dates, no future dates, no
duplicate `<loc>`; every URL resolves to a real file; and every indexable HTML file in the repo
appears in the sitemap (`404.html` correctly excluded).

> **Timing caveat.** The eight `2026-09-13` values are truthful only if the Tier 1 + Tier 2
> changeset deploys on 2026-09-13. If it slips, these need bumping to the actual deploy date
> before push — otherwise the sitemap under-reports freshness on exactly the pages that changed
> most.

### Items 8 & 9 — require Search Console access (not executable here)

These are console operations on your Google account; I have no access to it and cannot perform
or verify them. Precise steps:

**Item 8 — confirm `/fitness`'s bucket.** GSC → *Pages* → open the report and search for
`/fitness`, or use *URL Inspection* on `https://www.raphaatlas.com/fitness`. It is the one
sitemap URL absent from the twelve in "Crawled — currently not indexed". If it reads
**"Discovered — currently not indexed"**, that is a crawl-scheduling problem layered on the
quality one and worth treating separately. If it reads **"Indexed"**, then a single page
survived and its differences from the other hubs are worth studying.

**Item 9 — after deploying, request re-evaluation.** Resubmit `sitemap.xml` under GSC →
*Sitemaps*, then run *URL Inspection → Request Indexing* on the homepage plus the repaired
pages, prioritising `/medical-review-board`, `/about`, `/privacy` and the four calculators.
Recovery from "Crawled — currently not indexed" on a low-authority domain needs both a genuine
content delta and an explicit nudge. Expect weeks, not days, and expect partial recovery first.

### Escalated from Tier 3 — `seo_fix.cjs` is now an active hazard

Verified, not theoretical. `seo_fix.cjs` is frozen at its 2026-08-12 state and its hardcoded
`PAGES` list knows **14 pages, not 15**. Running it today would:

1. **Delete `/lifestyle` from the sitemap entirely** — the page was created 2026-08-30, after the
   script was last touched, and was never added to its list.
2. **Flatten all 15 `lastmod` values to today's date**, destroying the accurate dates just written
   and making every page claim identical freshness.
3. **Discard the hand-tuned priorities.** Its rule is `/`→1.0, `/calculators`→0.9, anything
   containing "calculator"→0.9, everything else→0.6 — which wipes the 0.8 hub tier, the 0.7
   policy tier, and `/privacy`'s 0.3.

One run would leave the sitemap worse than before the Aug 30 edit *and* drop a page from the
index. This is no longer a hygiene item; it is a live threat to the Tier 2 work. Recommended
fix is Tier 3 item 11: delete the sitemap-writing block (lines 290–299), since the file is now
hand-maintained.

---

## 10. Remediation Log — Tier 3 (applied 2026-09-13)

Tier 1 + Tier 2 were committed and pushed by the site owner (`fd87fc4`) and verified live
before this tier began: the placeholder text and the fabricated certifications are confirmed
absent from production, and `/privacy` grew 35,761 → 40,967 bytes on the live host. That
deploy landing on 2026-09-13 is what makes the Tier 2 `lastmod` dates truthful.

### Item 11 — the three rewrite scripts, neutralised ✅

A refusal guard now sits at the top of `seo_fix.cjs`, `unify_layout.cjs` and
`update_header_footer.cjs`. Each exits non-zero unless `RAPHAATLAS_ALLOW_REWRITE=1` is set,
and points at this report. Verified: all three refuse by default and leave the tree untouched.

**The sitemap generator has been deleted from `seo_fix.cjs`** (the former lines 290–299) and
replaced with a comment explaining why. The file's own header, which claimed *"Idempotent: safe
to run repeatedly,"* has been corrected — it is not, and has not been for some time.

**Root cause of the "deleted JSON-LD" failure named in the original brief — found.**
`stripManagedJsonLd()` at `seo_fix.cjs:108` contains:

```js
if (/data-ra=/.test(attrs)) return '';
```

Every `<script type="application/ld+json">` carrying a `data-ra=` attribute is deleted
**unconditionally, before any `@type` check**, and only the blocks the script itself knows how
to emit are restored. The `AboutPage` + two `Person` nodes added to
`medical-review-board.html` in Tier 1 carry `data-ra="reviewers"` and would have been wiped
without trace. This is the mechanism behind the historical JSON-LD losses, and it is now
documented in the file itself.

**Incidental finding: `unify_layout.cjs` has never been runnable in its committed state.** It
fails `node --check` with `SyntaxError: Invalid or unexpected token` at an unterminated
single-quoted string spanning lines 85–86 (a `'...'` literal containing a raw newline).
Confirmed against `HEAD`, so this predates the session. It therefore cannot have contributed to
the deindexing and cannot cause future damage. The guard was left in place for whenever the
syntax is repaired. **Recommendation: delete the file** — it is dead code that duplicates
`update_header_footer.cjs`, and its presence implies a working tool that does not exist.

### Item 12 — integrity gate ✅

New `check_integrity.cjs` (runs in ~1s over all 16 files), wired up as:

```
npm run check:integrity     # structure only
npm run check               # check:css && check:integrity
```

Plus a version-controlled `.githooks/pre-commit` that runs it before every commit;
`core.hooksPath` is set to `.githooks`. Bypass deliberately with `git commit --no-verify`.

It checks, per file: parse5 parse with zero errors; exactly one `<html>/<head>/<body>/<title>`;
non-empty title; balanced `<script>` tags; valid JSON in every JSON-LD block; no
zero-width/NBSP characters (reporting line number and whether the character sits inside a tag);
and exactly one `<main>` holding text above a floor. Across the repo it reconciles the sitemap
both ways — every `<loc>` resolves to a file, and every indexable page is listed.

**Fuzz-tested rather than assumed.** Nine corruptions were injected into a scratch copy and all
nine were caught: orphaned `<script>`, U+200B inside a tag, malformed JSON-LD, `<main>`
emptied, `<main>` deleted, duplicate `<head>`, duplicate `<title>`, a sitemap `<loc>` pointing
at no file, and a page dropped from the sitemap. The pre-commit hook was verified to actually
abort a real `git commit`.

> **One design note worth recording.** The first version measured the text floor against
> `<body>` and **missed a page whose entire `<main>` had been deleted** — the shared nav and
> footer contribute ~1,120 characters to every page, so any `<body>` floor low enough to avoid
> false positives still passes a fully gutted page. The check now measures inside `<main>`.
> Chrome is not content. This was caught only because the failure modes were actually
> injected; a checker that is never shown a broken file proves nothing.

### Item 10 — images self-hosted ✅, but read the content findings below

All **9 unique images** (10 `<img>` references) moved from `i.pinimg.com` to
`/assets/img/`, with descriptive filenames. The 4 now-pointless
`<link rel="preconnect" href="https://i.pinimg.com">` hints were removed, and the privacy
policy's third-party disclosure updated — Pinterest no longer receives visitors' IP addresses,
leaving Google Fonts as the only external request the site makes. **Zero external image hosts
remain.** All 15 local asset references verified to resolve; images confirmed loading in-browser
at full natural dimensions.

**However — self-hosting fixes availability and privacy. It does not confer any rights, and it
makes RaphaAtlas the direct host rather than a hotlinker.** Each image was opened and
inspected, and three are content problems that outlive the hosting change:

| Image | Finding |
|---|---|
| `macro-split-chart.jpg` | **Carries another company's branding** — "DIET by DESIGN — Eat Smart. Live Better." with their logo, on the macro-calculator money page. A third party's marketing asset presented as RaphaAtlas content. **Replace before anything else here.** |
| `conception-ovulation-chart.jpg` | Content is sound, but the image contains a visible typo — *"fertilization usually occurs **withis within** 24 hours after ovulation"* — baked into the pixels, on a physician-reviewed page. Not correctable by editing the page. |
| `health-anatomy-illustration.jpg` | An AI-generated Van Gogh *Starry Night* pastiche of human anatomy, used as the **Health** category image on the homepage. Decorative art, not a medical illustration, and derivative of a recognisable style. Off-register for a site whose whole claim is clinical rigour. |
| `body-fat-percentage-chart.jpg` | Accurate, and credits its source (American Council on Exercise) — but still a third party's infographic design. |

The remaining five are ordinary stock-style photographs.

Note also that `about.html`'s hero image (Tier 1, item 6) was found to depict something entirely
different from its stored description. Treat every one of these images as unverified until
checked — the descriptions in this repo have not been reliable.

**Recommendation:** commission or licence replacements for the four charts/illustrations,
starting with the branded one. Charts are also the easiest to simply rebuild — the underlying
figures are public, and a self-made chart carries no rights question and can match the site's
design.

### Item 13 — nav de-duplication: recommended AGAINST, not done ❌

Measured before deciding. The mobile drawer contributes **227 characters** of duplicated
navigation text per page, against main-content volumes of 2,323 (the thinnest real page) to
32,171 characters — between 0.7% and 9.8%, and under 10% even at worst. When this item was
written, `/health` carried 430 characters of unique text and the duplication genuinely mattered.
It no longer does.

Against that marginal gain: the drawer is a *functional* component (22 references to
`rah-burger` / `rah-drawer` / `rah-overlay`, JS-driven, with focus management and a skip link).
There are only two ways to change it, and neither is worth doing:

1. **Hide it with CSS while leaving it in the DOM** — achieves nothing for the stated goal,
   since text extraction and Google both still read DOM-present content.
2. **Render one nav and transform it responsively** — a real refactor of an accessible,
   JS-driven component across 16 files. That is precisely the kind of bulk markup rewrite that
   produced this repo's historical corruption, traded for a sub-2% boilerplate reduction.

A separate desktop nav and mobile drawer is also standard, correct practice, and boilerplate
detection is something search engines handle trivially. **This item should be closed as
won't-do, not carried forward.**

### Known issues left standing (out of approved scope)

All of the below were confirmed pre-existing by running the design detector against the
pre-edit `HEAD` tree and diffing the results, not assumed.

- **`clipped-overflow-container`** on `html` and `body` — flagged on every page. Comes from
  `html{overflow-x:hidden;overflow-x:clip}` in the chrome CSS, which exists deliberately so the
  closed mobile drawer (parked at `translateX(100%)`) cannot be scrolled to sideways. Fixing it
  properly means rethinking how the drawer is parked, site-wide.
- **`cramped-padding`** on `.rah-glass` and `.rah-drawer-top` — two per page, every page.
  Header-chrome elements whose children sit flush against a bottom border with no inset.
  Genuine but minor; the source of truth is the chrome template inside
  `update_header_footer.cjs`, so correcting it is a site-wide design change that would also
  require running a now-guarded script.
- **Sub-12px text** in `macro-calculator.html` (11px and 11.5px inline styles at lines 759, 825,
  858) and `bac-calculator.html`. Pre-existing accessibility issue.
- **`404.html` has no `<main>` landmark** — every other page does. Noted while building the
  integrity check, which exempts it. Worth adding for semantics and accessibility.
- **`rounded-DEFAULT`** was used in `contact.html` and is not valid Tailwind — it never
  generated a rule. Fixed there, but it is worth grepping future markup for: the class name
  looks plausible and fails silently.
