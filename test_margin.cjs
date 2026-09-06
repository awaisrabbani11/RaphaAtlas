/* Self-check for the body-type calculator's "margin to the next shape" logic.
   Run: node test_margin.cjs

   It does not restate the classifier — it slices the shipped logic out of
   body-type-calculator.html and evaluates that, so the test cannot drift away
   from the page the way a copied rule table would. */

const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(
  path.join(__dirname, "body-type-calculator.html"),
  "utf8"
);

/* The pure region of the widget: from the config block down to the point
   where DOM drawing starts. Everything in here is either a value or a
   function whose DOM references only fire when called. */
const START = "  var CM_PER_IN = 2.54;";
const END = "  // ---- Silhouette ---";
const a = html.indexOf(START);
const b = html.indexOf(END);
if (a < 0 || b < 0 || b <= a) {
  throw new Error(
    "Could not slice the calculator logic out of body-type-calculator.html — " +
      "the START/END markers moved. Fix the markers in this file."
  );
}
const source = html.slice(a, b);

const load = new Function(
  source + "\nreturn { FIELDS, classifyFemale, classifyMale, marginToNextShape, MARGIN_MAX_IN };"
);
const { FIELDS, classifyFemale, classifyMale, marginToNextShape, MARGIN_MAX_IN } = load();

let checks = 0;
function ok(cond, msg) {
  checks++;
  if (!cond) throw new Error("FAIL: " + msg);
}

/* Independent minimality probe. Deliberately written differently from the
   implementation — a flat scan of every field at one fixed distance — so it
   fails if the real search prunes too aggressively. */
function anyFlipAt(m, sex, current, dist) {
  const classify = sex === "female" ? classifyFemale : classifyMale;
  return FIELDS[sex].some((f) => {
    if (m[f.k] == null) return false;
    return [dist, -dist].some((d) => {
      const probe = Object.assign({}, m);
      probe[f.k] = m[f.k] + d;
      return probe[f.k] > 0 && classify(probe) !== current;
    });
  });
}

const CASES = [
  ["female", { bust: 38, waist: 27, hip: 38, highhip: 33 }],
  ["female", { bust: 34, waist: 30, hip: 40, highhip: 36 }],
  ["female", { bust: 36, waist: 34, hip: 36, highhip: 35 }],
  ["female", { bust: 40, waist: 31, hip: 34, highhip: 33 }],
  ["female", { bust: 33, waist: 26, hip: 40, highhip: 37 }],
  ["male", { chest: 42, waist: 32, hip: 38, shoulder: 46 }],
  ["male", { chest: 38, waist: 40, hip: 38, shoulder: null }],
  ["male", { chest: 38, waist: 36, hip: 39, shoulder: null }],
];

for (const [sex, m] of CASES) {
  const current = sex === "female" ? classifyFemale(m) : classifyMale(m);
  const best = marginToNextShape(m, sex, current);
  const label = sex + " " + JSON.stringify(m) + " => " + current;

  if (!best) {
    ok(
      !anyFlipAt(m, sex, current, MARGIN_MAX_IN),
      label + ": reported no nearby shape, but one exists inside the range"
    );
    continue;
  }

  // 1. The reported change actually produces the reported shape.
  const applied = Object.assign({}, m);
  applied[best.key] = m[best.key] + (best.up ? best.delta : -best.delta);
  const classify = sex === "female" ? classifyFemale : classifyMale;
  ok(
    classify(applied) === best.to,
    label +
      ": applying " +
      (best.up ? "+" : "-") +
      best.delta +
      ' to "' +
      best.key +
      '" gave ' +
      classify(applied) +
      ", not the promised " +
      best.to
  );

  // 2. It is the SMALLEST such change — nothing flips one step closer in.
  //    This is the claim the meta description makes; if it is wrong, the page
  //    is telling readers a borderline result is safe, or vice versa.
  const closer = Math.round((best.delta - 0.1) * 10) / 10;
  if (closer > 0) {
    ok(
      !anyFlipAt(m, sex, current, closer),
      label +
        ": reported the nearest shape at " +
        best.delta +
        ' in, but something flips at ' +
        closer +
        " in"
    );
  }

  // 3. The borderline flag and the number it is derived from agree.
  ok(
    best.delta > 0 && best.delta <= MARGIN_MAX_IN,
    label + ": margin " + best.delta + " is outside the searched range"
  );
}

console.log("ok — " + checks + " assertions across " + CASES.length + " cases");
