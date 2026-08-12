const fs = require('fs');

const tailwindConfig = `
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com" rel="preconnect">
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "tertiary-fixed-dim": "#c6c6c7",
                      "on-tertiary-container": "#838484",
                      "on-primary-container": "#848484",
                      "on-tertiary-fixed-variant": "#454747",
                      "on-error-container": "#93000a",
                      "tertiary-container": "#1a1c1c",
                      "on-primary-fixed": "#1b1b1b",
                      "surface-container-low": "#f9f3eb",
                      "background": "#fff8f0",
                      "outline-variant": "#cfc4c5",
                      "surface-container-high": "#ede7df",
                      "error-container": "#ffdad6",
                      "on-secondary-fixed": "#002023",
                      "error": "#ba1a1a",
                      "on-primary-fixed-variant": "#474747",
                      "primary-fixed-dim": "#c6c6c6",
                      "surface-container": "#f3ede5",
                      "surface-container-highest": "#e7e2da",
                      "vitality-teal": "#02838D",
                      "secondary-fixed-dim": "#75d5e0",
                      "on-background": "#1d1b17",
                      "surface-container-lowest": "#ffffff",
                      "secondary-fixed": "#92f1fc",
                      "primary-fixed": "#e2e2e2",
                      "on-secondary-fixed-variant": "#004f55",
                      "border-subtle": "#E0EDEF",
                      "on-surface-variant": "#4c4546",
                      "header-black": "#000000",
                      "surface": "#fff8f0",
                      "on-tertiary-fixed": "#1a1c1c",
                      "on-surface": "#1d1b17",
                      "on-tertiary": "#ffffff",
                      "surface-tint": "#5e5e5e",
                      "secondary": "#006971",
                      "on-secondary-container": "#006d76",
                      "inverse-on-surface": "#f6f0e8",
                      "outline": "#7e7576",
                      "secondary-container": "#8feff9",
                      "surface-variant": "#e7e2da",
                      "inverse-surface": "#32302b",
                      "primary": "#000000",
                      "surface-dim": "#dfd9d2",
                      "on-primary": "#ffffff",
                      "surface-cream": "#FBF5ED",
                      "on-error": "#ffffff",
                      "primary-container": "#1b1b1b",
                      "inverse-primary": "#c6c6c6",
                      "tertiary": "#000000",
                      "surface-bright": "#fff8f0",
                      "on-secondary": "#ffffff",
                      "tertiary-fixed": "#e2e2e2"
              },
              "borderRadius": {
                      "DEFAULT": "0.125rem",
                      "lg": "0.25rem",
                      "xl": "0.5rem",
                      "full": "0.75rem"
              },
              "spacing": {
                      "margin-mobile": "16px",
                      "gutter": "24px",
                      "container-max": "1280px",
                      "section-gap": "80px",
                      "base": "8px"
              },
              "fontFamily": {
                      "display-lg": ["Montserrat"],
                      "headline-md": ["Montserrat"],
                      "body-md": ["Inter"],
                      "display-lg-mobile": ["Montserrat"],
                      "nav-link": ["Inter"],
                      "label-bold": ["Inter"],
                      "body-lg": ["Inter"]
              },
              "fontSize": {
                      "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                      "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
                      "body-md": ["16px", { "lineHeight": "26px", "fontWeight": "400" }],
                      "display-lg-mobile": ["32px", { "lineHeight": "40px", "fontWeight": "700" }],
                      "nav-link": ["15px", { "lineHeight": "24px", "fontWeight": "500" }],
                      "label-bold": ["14px", { "lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "700" }],
                      "body-lg": ["18px", { "lineHeight": "30px", "fontWeight": "400" }]
              }
      },
          },
        }
</script>
<style>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24
}
</style>
`;

const navAndFooter = {
  nav: `
<nav class="hidden lg:flex items-center space-x-6">
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors font-nav-link text-nav-link" href="/nutrition">Nutrition</a>
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors font-nav-link text-nav-link" href="/health">Health</a>
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors font-nav-link text-nav-link" href="/calculators">Calculators</a>
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors font-nav-link text-nav-link" href="/fitness">Fitness</a>
<div class="relative group">
<button class="flex items-center space-x-1 text-on-primary font-bold hover:text-vitality-teal transition-colors font-nav-link text-nav-link py-2">
<span>More</span>
<span class="material-symbols-outlined text-sm">expand_more</span>
</button>
<div class="absolute left-0 mt-2 w-48 bg-surface-container-lowest border border-header-black hidden group-hover:block z-50 shadow-lg">
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all font-body-md text-body-md border-b border-border-subtle" href="/about">About Us</a>
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all font-body-md text-body-md" href="/contact">Contact Us</a>
</div>
</div>
</nav>
  `,
  footer: `
<footer class="bg-header-black text-on-primary w-full py-12 px-4 md:px-8 flex flex-col md:flex-row justify-between mt-auto">
<div class="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center">
<div class="mb-8 md:mb-0">
<a href="/" class="flex items-center mb-2">
  <img src="/raphaatlas-mark.svg" alt="RaphaAtlas" height="50" width="50" class="h-12 w-12">
  <span style="font-family: 'Merriweather', 'Georgia', serif; font-size: 40px; font-weight: 900; letter-spacing: -1.5px; color: white; margin-left: 14px; transform: translateY(2px);">RaphaAtlas</span>
</a>
</div>
<div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8" style="font-family: 'Inter', sans-serif;">
<a class="text-on-primary opacity-50 hover:opacity-100 transition-opacity" href="/about">About Us</a>
<a class="text-on-primary opacity-50 hover:opacity-100 transition-opacity" href="/editorial-policy">Editorial Policy</a>
<a class="text-on-primary opacity-50 hover:opacity-100 transition-opacity" href="/medical-review-board">Medical Review Board</a>
<a class="text-on-primary opacity-50 hover:opacity-100 transition-opacity" href="/contact">Contact</a>
<a class="text-on-primary opacity-50 hover:opacity-100 transition-opacity" href="/privacy">Privacy Policy</a>
</div>
<div class="mt-8 md:mt-0 text-on-primary opacity-30 text-sm" style="font-family: 'Inter', sans-serif;">© 2024 RaphaAtlas. All rights reserved.</div>
</div>
</footer>
  `
};

const makePage = (title, metaDesc, content, scripts) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>${title} - RaphaAtlas</title>
<meta name="description" content="${metaDesc}">
${tailwindConfig}
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "vitality-teal": "#02838D",
                        "header-black": "#000000",
                        "surface-cream": "#FBF5ED",
                        "on-primary": "#ffffff",
                        "primary": "#000000",
                        "surface-container-lowest": "#ffffff",
                        "border-subtle": "#E0EDEF",
                        "on-surface": "#1d1b17",
                    }
                }
            }
        }
    </script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Montserrat:wght@600;700;900&family=Archivo:wght@700&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="/raphaatlas-favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@900&display=swap" rel="stylesheet">
</head>
<body class="bg-surface-lowest text-on-surface font-body-md min-h-screen flex flex-col antialiased">
<header class="bg-header-black border-b border-black docked full-width top-0 z-50 sticky transition-all duration-300">
<div class="flex justify-between items-center px-4 md:px-8 py-2 w-full max-w-7xl mx-auto">
<a href="/" aria-label="RaphaAtlas home" class="flex items-center">
  <img src="/raphaatlas-mark.svg" alt="RaphaAtlas Logo" height="40" width="40" class="h-10 w-10">
  <span style="font-family: 'Merriweather', 'Georgia', serif; font-size: 34px; font-weight: 900; letter-spacing: -1.5px; color: white; margin-left: 12px; transform: translateY(2px);">RaphaAtlas</span>
</a>
<nav class="hidden lg:flex items-center space-x-6">
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors" style="font-family: 'Inter', sans-serif;" href="/nutrition">Nutrition</a>
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors" style="font-family: 'Inter', sans-serif;" href="/health">Health</a>
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors" style="font-family: 'Inter', sans-serif;" href="/calculators">Calculators</a>
<a class="text-on-primary font-bold hover:text-vitality-teal transition-colors" style="font-family: 'Inter', sans-serif;" href="/fitness">Fitness</a>
<div class="relative group">
<button class="flex items-center space-x-1 text-on-primary font-bold hover:text-vitality-teal transition-colors py-2" style="font-family: 'Inter', sans-serif;">
<span>More</span>
<span class="material-symbols-outlined text-sm">expand_more</span>
</button>
<div class="absolute left-0 mt-2 w-56 bg-surface-container-lowest border border-header-black hidden group-hover:block z-50 shadow-lg">
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all border-b border-border-subtle" href="/about">About Us</a>
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all border-b border-border-subtle" href="/editorial-policy">Editorial Policy</a>
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all border-b border-border-subtle" href="/medical-review-board">Medical Review Board</a>
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all border-b border-border-subtle" href="/privacy">Privacy Policy</a>
<a class="block px-4 py-3 text-on-surface hover:bg-surface-cream hover:border-l-4 border-vitality-teal transition-all" href="/contact">Contact Us</a>
</div>
</div>
</nav>
<div class="flex items-center space-x-4">
<button class="text-on-primary hover:text-vitality-teal transition-colors"><span class="material-symbols-outlined">search</span></button>
<button class="lg:hidden text-on-primary"><span class="material-symbols-outlined text-2xl">menu</span></button>
</div>
</div>
</header>
${navAndFooter.nav}
<main class="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-12 md:py-section-gap">
  <div class="max-w-3xl mx-auto">
    ${content}
  </div>
</main>
${navAndFooter.footer}
${scripts}
</body>
</html>`;

const macrosContent = `
<div class="mb-12 text-center">
  <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
    <span class="material-symbols-outlined text-on-primary text-3xl" data-icon="restaurant_menu">restaurant_menu</span>
  </div>
  <h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">Macro Calculator</h1>
  <p class="font-body-lg text-body-lg text-on-surface-variant">Get daily protein, carbohydrate, and fat targets tailored to your goal — losing fat, maintaining, or building muscle.</p>
</div>

<div class="bg-surface-cream rounded-xl p-8 md:p-12 border border-border-subtle shadow-sm mb-12">
  <form id="macroForm" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block font-label-bold text-label-bold text-primary mb-2" for="mac_gender">Gender</label>
        <select id="mac_gender" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal appearance-none" required>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div>
        <label class="block font-label-bold text-label-bold text-primary mb-2" for="mac_age">Age (Years)</label>
        <input type="number" id="mac_age" min="15" max="100" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal" required placeholder="e.g. 30">
      </div>
      <div>
        <label class="block font-label-bold text-label-bold text-primary mb-2" for="mac_weight">Weight (lbs)</label>
        <input type="number" id="mac_weight" min="50" max="500" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal" required placeholder="e.g. 165">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-label-bold text-label-bold text-primary mb-2" for="mac_ft">Height (ft)</label>
          <input type="number" id="mac_ft" min="4" max="8" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal" required placeholder="e.g. 5">
        </div>
        <div>
          <label class="block font-label-bold text-label-bold text-primary mb-2" for="mac_in">Height (in)</label>
          <input type="number" id="mac_in" min="0" max="11" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal" required placeholder="e.g. 10">
        </div>
      </div>
      <div class="md:col-span-2">
        <label class="block font-label-bold text-label-bold text-primary mb-2" for="mac_activity">Activity Level</label>
        <select id="mac_activity" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal appearance-none" required>
          <option value="1.2">Sedentary (little to no exercise)</option>
          <option value="1.375">Lightly Active (light exercise 1-3 days/wk)</option>
          <option value="1.55">Moderately Active (exercise 3-5 days/wk)</option>
          <option value="1.725">Very Active (hard exercise 6-7 days/wk)</option>
        </select>
      </div>
      <div class="md:col-span-2">
        <label class="block font-label-bold text-label-bold text-primary mb-2" for="mac_goal">Your Goal</label>
        <select id="mac_goal" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal appearance-none" required>
          <option value="lose">Lose Fat (-500 kcal)</option>
          <option value="maintain" selected>Maintain Weight</option>
          <option value="build">Build Muscle (+500 kcal)</option>
        </select>
      </div>
    </div>
    <div class="pt-4">
      <button type="submit" class="w-full bg-vitality-teal text-on-primary font-label-bold text-label-bold rounded-full py-4 px-6 hover:bg-secondary transition-colors uppercase tracking-widest">Calculate My Macros</button>
    </div>
  </form>

  <div id="mac_result" class="hidden mt-10 pt-10 border-t border-border-subtle">
    <h3 class="font-headline-md text-headline-md text-primary text-center mb-8">Your Daily Targets</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-surface-lowest border border-border-subtle rounded-xl p-6 text-center">
        <span class="block font-label-bold text-on-surface-variant uppercase tracking-widest mb-2">Protein</span>
        <strong id="mac_protein" class="block font-display-lg-mobile text-vitality-teal">0g</strong>
      </div>
      <div class="bg-surface-lowest border border-border-subtle rounded-xl p-6 text-center">
        <span class="block font-label-bold text-on-surface-variant uppercase tracking-widest mb-2">Fats</span>
        <strong id="mac_fat" class="block font-display-lg-mobile text-vitality-teal">0g</strong>
      </div>
      <div class="bg-surface-lowest border border-border-subtle rounded-xl p-6 text-center">
        <span class="block font-label-bold text-on-surface-variant uppercase tracking-widest mb-2">Carbs</span>
        <strong id="mac_carbs" class="block font-display-lg-mobile text-vitality-teal">0g</strong>
      </div>
    </div>
    <p class="font-headline-md text-primary text-center">Target Calories: <span id="mac_cals" class="text-vitality-teal font-bold">0</span> kcal/day</p>
  </div>
</div>

<div class="prose max-w-none text-on-surface-variant">
  <p class="text-sm italic mb-8">This tool provides general estimates for educational purposes only and is not a substitute for professional medical advice.</p>
  <h2 class="font-headline-md text-primary mb-4">How this calculator works</h2>
  <p class="mb-8">The calculator estimates your daily energy needs from your metrics and activity, then divides that total into protein, carbohydrate, and fat targets suited to your goal.</p>
  
  <h2 class="font-headline-md text-primary mb-4">Frequently asked questions</h2>
  <h3 class="font-bold text-primary mb-2">How are my macros calculated?</h3>
  <p class="mb-6">Your total daily calories are estimated first, then split into grams of protein, carbohydrate, and fat using ratios suited to your goal and activity level.</p>
  
  <h3 class="font-bold text-primary mb-2">Should I hit my macros exactly every day?</h3>
  <p class="mb-8">Aim for consistency across the week rather than perfection each day. Small daily variation is normal and does not undermine results.</p>
</div>
`;

const macrosScript = `<script>
  document.getElementById('macroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const gender = document.getElementById('mac_gender').value;
    const age = parseInt(document.getElementById('mac_age').value, 10);
    const weightLbs = parseFloat(document.getElementById('mac_weight').value);
    const heightFt = parseInt(document.getElementById('mac_ft').value, 10);
    const heightIn = parseInt(document.getElementById('mac_in').value, 10);
    const activity = parseFloat(document.getElementById('mac_activity').value);
    const goal = document.getElementById('mac_goal').value;

    const weightKg = weightLbs * 0.453592;
    const heightCm = ((heightFt * 12) + heightIn) * 2.54;

    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    let tdee = bmr * activity;

    if (goal === 'lose') tdee -= 500;
    if (goal === 'build') tdee += 500;

    if (gender === 'male' && tdee < 1500) tdee = 1500;
    if (gender === 'female' && tdee < 1200) tdee = 1200;

    tdee = Math.round(tdee);

    let proteinPct, fatPct, carbPct;
    if (goal === 'lose') {
      proteinPct = 0.40; fatPct = 0.30; carbPct = 0.30;
    } else if (goal === 'build') {
      proteinPct = 0.30; fatPct = 0.25; carbPct = 0.45;
    } else {
      proteinPct = 0.30; fatPct = 0.30; carbPct = 0.40;
    }

    const proteinGrams = Math.round((tdee * proteinPct) / 4);
    const fatGrams = Math.round((tdee * fatPct) / 9);
    const carbGrams = Math.round((tdee * carbPct) / 4);

    document.getElementById('mac_protein').innerText = proteinGrams + "g";
    document.getElementById('mac_fat').innerText = fatGrams + "g";
    document.getElementById('mac_carbs').innerText = carbGrams + "g";
    document.getElementById('mac_cals').innerText = tdee;

    document.getElementById('mac_result').classList.remove('hidden');
  });
</script>`;

const bodyTypeContent = `
<div class="mb-12 text-center">
  <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
    <span class="material-symbols-outlined text-on-primary text-3xl" data-icon="accessibility_new">accessibility_new</span>
  </div>
  <h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">Body Type Calculator</h1>
  <p class="font-body-lg text-body-lg text-on-surface-variant">Find your dominant somatotype and learn how it shapes the way you should train and eat.</p>
</div>

<div class="bg-surface-cream rounded-xl p-8 md:p-12 border border-border-subtle shadow-sm mb-12">
  <form id="bodyTypeForm" class="space-y-6">
    <div>
      <label class="block font-label-bold text-label-bold text-primary mb-2" for="bt_shoulders">1. My shoulders are...</label>
      <select id="bt_shoulders" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal appearance-none" required>
        <option value="" disabled selected>Select an option...</option>
        <option value="ecto">Narrower than my hips</option>
        <option value="meso">Wider than my hips</option>
        <option value="endo">About the same width as my hips</option>
      </select>
    </div>
    <div>
      <label class="block font-label-bold text-label-bold text-primary mb-2" for="bt_wrist">2. When I grab my opposite wrist with my thumb and middle finger...</label>
      <select id="bt_wrist" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal appearance-none" required>
        <option value="" disabled selected>Select an option...</option>
        <option value="ecto">My fingers overlap easily</option>
        <option value="meso">My fingers just barely touch</option>
        <option value="endo">My fingers do not touch at all</option>
      </select>
    </div>
    <div>
      <label class="block font-label-bold text-label-bold text-primary mb-2" for="bt_weight">3. When it comes to weight gain, I...</label>
      <select id="bt_weight" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal appearance-none" required>
        <option value="" disabled selected>Select an option...</option>
        <option value="ecto">Struggle to gain weight or muscle (fast metabolism)</option>
        <option value="meso">Gain muscle and lose fat relatively easily</option>
        <option value="endo">Gain weight easily, but struggle to lose fat</option>
      </select>
    </div>
    <div class="pt-4">
      <button type="submit" class="w-full bg-vitality-teal text-on-primary font-label-bold text-label-bold rounded-full py-4 px-6 hover:bg-secondary transition-colors uppercase tracking-widest">Calculate Body Type</button>
    </div>
  </form>

  <div id="bt_result" class="hidden mt-10 pt-10 border-t border-border-subtle text-center">
    <h3 id="bt_type" class="font-headline-md text-headline-md text-vitality-teal mb-4"></h3>
    <p id="bt_desc" class="font-body-lg text-primary"></p>
  </div>
</div>

<div class="prose max-w-none text-on-surface-variant">
  <p class="text-sm italic mb-8">This tool provides general estimates for educational purposes only and is not a substitute for professional medical advice.</p>
  <h2 class="font-headline-md text-primary mb-4">How this calculator works</h2>
  <p class="mb-8">This tool estimates your dominant body type from your frame and measurements, then maps that tendency to practical training and nutrition guidance.</p>
  
  <h2 class="font-headline-md text-primary mb-4">Frequently asked questions</h2>
  <h3 class="font-bold text-primary mb-2">What are the three body types?</h3>
  <p class="mb-6">The three somatotypes are ectomorph (lean, narrow frame), mesomorph (muscular build), and endomorph (softer, wider frame). Most people are a blend of two.</p>
  <h3 class="font-bold text-primary mb-2">Can my body type change?</h3>
  <p class="mb-8">Your underlying frame is largely fixed, but body composition changes with training and nutrition, so your appearance and performance can shift substantially.</p>
</div>
`;

const bodyTypeScript = `<script>
  document.getElementById('bodyTypeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const v1 = document.getElementById('bt_shoulders').value;
    const v2 = document.getElementById('bt_wrist').value;
    const v3 = document.getElementById('bt_weight').value;
    
    let scores = { ecto: 0, meso: 0, endo: 0 };
    scores[v1]++;
    scores[v2]++;
    scores[v3]++;
    
    let max = 'ecto';
    if (scores.meso > scores[max]) max = 'meso';
    if (scores.endo > scores[max]) max = 'endo';
    if (scores.ecto === 1 && scores.meso === 1 && scores.endo === 1) max = 'meso';
    
    const types = {
      ecto: { title: "Ectomorph", desc: "You typically have a leaner, slighter frame and a fast metabolism. You likely excel at endurance activities but may need to eat in a caloric surplus and focus on heavy compound lifts to build significant muscle mass." },
      meso: { title: "Mesomorph", desc: "You naturally have a more athletic, v-tapered or hourglass frame. You tend to respond very well to a balanced mix of strength training and cardio, gaining muscle and shedding fat with moderate dietary adjustments." },
      endo: { title: "Endomorph", desc: "You have a solid, wider or stockier frame and may gain both muscle and fat easily. You generally benefit from a higher frequency of metabolic conditioning or cardio, alongside a carefully managed diet to stay lean." }
    };
    
    document.getElementById('bt_type').innerText = "Your Body Type: " + types[max].title;
    document.getElementById('bt_desc').innerText = types[max].desc;
    document.getElementById('bt_result').classList.remove('hidden');
  });
</script>`;

const bacContent = `
<div class="mb-12 text-center">
  <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
    <span class="material-symbols-outlined text-on-primary text-3xl" data-icon="local_bar">local_bar</span>
  </div>
  <h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">BAC Calculator</h1>
  <p class="font-body-lg text-body-lg text-on-surface-variant">Estimate your blood alcohol concentration from the drinks you have had, your body weight, sex, and elapsed time.</p>
</div>

<div class="bg-surface-cream rounded-xl p-8 md:p-12 border border-border-subtle shadow-sm mb-12">
  <form id="bacForm" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block font-label-bold text-label-bold text-primary mb-2" for="bac_gender">Biological Sex</label>
        <select id="bac_gender" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal appearance-none" required>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div>
        <label class="block font-label-bold text-label-bold text-primary mb-2" for="bac_weight">Body Weight (lbs)</label>
        <input type="number" id="bac_weight" min="50" max="500" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal" required placeholder="e.g. 150">
      </div>
      <div>
        <label class="block font-label-bold text-label-bold text-primary mb-2" for="bac_drinks">Number of Standard Drinks</label>
        <input type="number" id="bac_drinks" step="0.5" min="0" max="30" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal" required placeholder="e.g. 2">
        <p class="text-xs text-on-surface-variant mt-2">1 drink = 12oz beer, 5oz wine, 1.5oz liquor</p>
      </div>
      <div>
        <label class="block font-label-bold text-label-bold text-primary mb-2" for="bac_hours">Hours since first drink</label>
        <input type="number" id="bac_hours" step="0.5" min="0" max="48" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal" required placeholder="e.g. 2.5">
      </div>
    </div>
    <div class="pt-4">
      <button type="submit" class="w-full bg-vitality-teal text-on-primary font-label-bold text-label-bold rounded-full py-4 px-6 hover:bg-secondary transition-colors uppercase tracking-widest">Estimate BAC</button>
    </div>
  </form>

  <div id="bac_result" class="hidden mt-10 pt-10 border-t border-border-subtle text-center">
    <h3 class="font-label-bold text-on-surface-variant uppercase tracking-widest mb-4">Estimated BAC</h3>
    <p id="bac_value" class="text-6xl font-display-lg text-primary mb-6">0.00%</p>
    <div id="bac_desc" class="inline-block px-6 py-3 rounded-lg font-bold text-lg"></div>
  </div>
</div>

<div class="prose max-w-none text-on-surface-variant">
  <p class="text-sm italic mb-8">This tool provides general estimates for educational purposes only and is not a substitute for professional medical advice. Never use a calculator to determine if it is safe to drive.</p>
  <h2 class="font-headline-md text-primary mb-4">How this calculator works</h2>
  <p class="mb-8">The calculator applies the Widmark method, combining alcohol consumed with your estimated body water and time elapsed to approximate current BAC.</p>
  
  <h2 class="font-headline-md text-primary mb-4">Frequently asked questions</h2>
  <h3 class="font-bold text-primary mb-2">How accurate is a BAC calculator?</h3>
  <p class="mb-6">It gives an estimate only. Real BAC varies with food, medication, metabolism, and hydration — never use a calculator to decide whether it is safe to drive.</p>
  <h3 class="font-bold text-primary mb-2">How long does alcohol stay in your system?</h3>
  <p class="mb-8">The body clears roughly one standard drink per hour on average, but this varies. Only time lowers BAC; coffee and water do not speed it up.</p>
</div>
`;

const bacScript = `<script>
  document.getElementById('bacForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const gender = document.getElementById('bac_gender').value;
    const weightLbs = parseFloat(document.getElementById('bac_weight').value);
    const drinks = parseFloat(document.getElementById('bac_drinks').value);
    const hours = parseFloat(document.getElementById('bac_hours').value);

    const alcoholGrams = drinks * 14; 
    const weightGrams = weightLbs * 453.592;
    const r = (gender === 'male') ? 0.68 : 0.55;

    let bac = ((alcoholGrams / (weightGrams * r)) * 100) - (0.015 * hours);
    
    if (bac < 0) bac = 0;

    document.getElementById('bac_value').innerText = bac.toFixed(3) + "%";

    const descEl = document.getElementById('bac_desc');
    descEl.className = 'inline-block px-6 py-3 rounded-lg font-bold text-lg'; // reset

    if (bac === 0) {
      descEl.innerText = "Sober. Zero alcohol detected.";
      descEl.classList.add('bg-green-100', 'text-green-800');
    } else if (bac < 0.04) {
      descEl.innerText = "Mild impairment. Lightheadedness and relaxation.";
      descEl.classList.add('bg-green-100', 'text-green-800');
    } else if (bac < 0.08) {
      descEl.innerText = "Impairment. Lowered inhibitions, reasoning, and depth perception. Driving is unsafe.";
      descEl.classList.add('bg-yellow-100', 'text-yellow-800');
    } else if (bac < 0.20) {
      descEl.innerText = "Legally intoxicated (>= 0.08%). Significant impairment of motor coordination and judgement. Do not drive.";
      descEl.classList.add('bg-red-100', 'text-red-800');
    } else if (bac < 0.30) {
      descEl.innerText = "Severe intoxication. Confusion, nausea, and potential blackouts.";
      descEl.classList.add('bg-red-100', 'text-red-800');
    } else {
      descEl.innerText = "Medical emergency. High risk of alcohol poisoning, loss of consciousness, and death.";
      descEl.classList.add('bg-red-200', 'text-red-900');
    }

    document.getElementById('bac_result').classList.remove('hidden');
  });
</script>`;

const conceptionContent = `
<div class="mb-12 text-center">
  <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
    <span class="material-symbols-outlined text-on-primary text-3xl" data-icon="child_care">child_care</span>
  </div>
  <h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">Conception Calculator</h1>
  <p class="font-body-lg text-body-lg text-on-surface-variant">Estimate your likely conception date and due date from your last menstrual period, cycle length, or a date you already know.</p>
</div>

<div class="bg-surface-cream rounded-xl p-8 md:p-12 border border-border-subtle shadow-sm mb-12">
  <form id="conceptForm" class="space-y-6">
    <div>
      <label class="block font-label-bold text-label-bold text-primary mb-2" for="con_method">Calculate based on</label>
      <select id="con_method" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal appearance-none" required>
        <option value="lmp">First day of last period</option>
        <option value="due">Known due date</option>
      </select>
    </div>
    <div>
      <label id="con_date_label" class="block font-label-bold text-label-bold text-primary mb-2" for="con_date">First day of last period</label>
      <input type="date" id="con_date" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal" required>
    </div>
    <div id="con_cycle_field">
      <label class="block font-label-bold text-label-bold text-primary mb-2" for="con_cycle">Average cycle length (days)</label>
      <input type="number" id="con_cycle" min="20" max="45" value="28" class="w-full bg-surface-lowest border border-black rounded px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-1 focus:ring-vitality-teal focus:border-vitality-teal" required>
    </div>
    <div class="pt-4">
      <button type="submit" class="w-full bg-vitality-teal text-on-primary font-label-bold text-label-bold rounded-full py-4 px-6 hover:bg-secondary transition-colors uppercase tracking-widest">Calculate Dates</button>
    </div>
  </form>

  <div id="con_result" class="hidden mt-10 pt-10 border-t border-border-subtle">
    <h3 class="font-headline-md text-headline-md text-primary text-center mb-8">Your Results</h3>
    <div class="space-y-4">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center py-4 border-b border-border-subtle">
        <span class="font-body-lg text-on-surface-variant">Estimated Due Date:</span>
        <strong id="res_due" class="font-headline-md text-vitality-teal"></strong>
      </div>
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center py-4 border-b border-border-subtle">
        <span class="font-body-lg text-on-surface-variant">Estimated Conception Date:</span>
        <strong id="res_concept" class="font-headline-md text-primary"></strong>
      </div>
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center py-4">
        <span class="font-body-lg text-on-surface-variant">Likely Fertile Window:</span>
        <strong id="res_fertile" class="font-headline-md text-primary"></strong>
      </div>
    </div>
  </div>
</div>

<div class="prose max-w-none text-on-surface-variant">
  <p class="text-sm italic mb-8">This tool provides general estimates for educational purposes only and is not a substitute for professional medical advice.</p>
  <h2 class="font-headline-md text-primary mb-4">How this calculator works</h2>
  <p class="mb-8">The tool works from your last menstrual period and cycle length to estimate ovulation and conception, then projects a due date about 40 weeks from your last period.</p>
  
  <h2 class="font-headline-md text-primary mb-4">Frequently asked questions</h2>
  <h3 class="font-bold text-primary mb-2">How accurate is an estimated conception date?</h3>
  <p class="mb-6">It is an estimate based on a typical cycle. Actual conception depends on when ovulation occurred, which varies, so an ultrasound gives a more precise date.</p>
  <h3 class="font-bold text-primary mb-2">Can I find the exact day I conceived?</h3>
  <p class="mb-8">Rarely with certainty. Sperm can survive several days, so conception may occur days after intercourse. The tool gives a likely window, not an exact day.</p>
</div>
`;

const conceptionScript = `<script>
  const methodSelect = document.getElementById('con_method');
  const dateLabel = document.getElementById('con_date_label');
  const cycleField = document.getElementById('con_cycle_field');

  methodSelect.addEventListener('change', function() {
    if (this.value === 'lmp') {
      dateLabel.innerText = "First day of last period";
      cycleField.style.display = 'block';
    } else {
      dateLabel.innerText = "Known due date";
      cycleField.style.display = 'none';
    }
  });

  document.getElementById('conceptForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const method = document.getElementById('con_method').value;
    const dateInput = document.getElementById('con_date').value;
    const cycleLength = parseInt(document.getElementById('con_cycle').value, 10);
    
    if (!dateInput) return;

    const inputDate = new Date(dateInput);
    inputDate.setMinutes(inputDate.getMinutes() + inputDate.getTimezoneOffset());

    let dueDate, conceptDate;

    if (method === 'lmp') {
      const addedDays = 280 + (cycleLength - 28);
      dueDate = new Date(inputDate.getTime());
      dueDate.setDate(dueDate.getDate() + addedDays);

      conceptDate = new Date(inputDate.getTime());
      conceptDate.setDate(conceptDate.getDate() + (cycleLength - 14));
    } else {
      dueDate = new Date(inputDate.getTime());
      conceptDate = new Date(dueDate.getTime());
      conceptDate.setDate(conceptDate.getDate() - 266);
    }

    const fertileStart = new Date(conceptDate.getTime());
    fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(conceptDate.getTime());
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    const shortOptions = { month: 'short', day: 'numeric' };
    
    document.getElementById('res_due').innerText = dueDate.toLocaleDateString(undefined, options);
    document.getElementById('res_concept').innerText = conceptDate.toLocaleDateString(undefined, options);
    document.getElementById('res_fertile').innerText = fertileStart.toLocaleDateString(undefined, shortOptions) + " — " + fertileEnd.toLocaleDateString(undefined, shortOptions);

    document.getElementById('con_result').classList.remove('hidden');
  });
</script>`;

fs.writeFileSync('macro-calculator.html', makePage('Macro Calculator', 'Free macro calculator. Get personalized daily protein, carbohydrate, and fat targets based on your goals, activity, and body metrics.', macrosContent, macrosScript));
fs.writeFileSync('body-type-calculator.html', makePage('Body Type Calculator', 'Free body type calculator. Find whether you are an ectomorph, mesomorph, or endomorph and what it means for training and nutrition.', bodyTypeContent, bodyTypeScript));
fs.writeFileSync('bac-calculator.html', makePage('BAC Calculator', 'Free BAC calculator. Estimate blood alcohol concentration from drinks, body weight, sex, and time, with clear safety context.', bacContent, bacScript));
fs.writeFileSync('conception-calculator.html', makePage('Conception Calculator', 'Free conception calculator. Estimate your likely conception date and due date from your last period, cycle length, or a known date.', conceptionContent, conceptionScript));

console.log("Success");
