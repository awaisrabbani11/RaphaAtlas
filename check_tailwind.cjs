/* Guards the two ways the Tailwind swap can silently regress:
     1. a page reintroduces the cdn.tailwindcss.com runtime;
     2. someone adds a utility class to markup and forgets `npm run build:css`,
        so the committed tailwind.css no longer contains it.
   Run: npm run check:css   (exits non-zero on either)
*/
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const fail = [];

for (const f of fs.readdirSync(".").filter((f) => f.endsWith(".html"))) {
  const html = fs.readFileSync(f, "utf8");
  if (/<script[^>]+cdn\.tailwindcss\.com/.test(html))
    fail.push(`${f}: still loads the cdn.tailwindcss.com runtime`);
}

const tmp = path.join(os.tmpdir(), `tw-check-${process.pid}.css`);
// call the CLI's JS entry directly — node refuses to spawn the .cmd shim on Windows
execFileSync(
  process.execPath,
  [
    require.resolve("tailwindcss/lib/cli.js"),
    "-c", "tailwind.config.cjs",
    "-i", "src/tailwind.css",
    "-o", tmp,
    "--minify",
  ],
  { stdio: "ignore" }
);
if (fs.readFileSync(tmp, "utf8") !== fs.readFileSync("tailwind.css", "utf8"))
  fail.push("tailwind.css is stale — run `npm run build:css` and commit the result");
fs.unlinkSync(tmp);

if (fail.length) {
  console.error(fail.map((m) => "FAIL " + m).join("\n"));
  process.exit(1);
}
console.log("ok: no CDN runtime, tailwind.css matches the markup");
