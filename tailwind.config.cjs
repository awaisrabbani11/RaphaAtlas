/* Theme lifted verbatim from the old inline `tailwind.config` that every page
   shipped alongside the cdn.tailwindcss.com runtime. Nothing here is new —
   it just moved from 15 copies in the HTML to one file the CLI reads at build
   time, so the browser gets plain CSS instead of a 400 KB JIT compiler.

   `darkMode: "class"` and the container-queries plugin were in the old config
   but no page uses a `dark:` or `@container` variant, so they are gone.

   Rebuild after editing markup: npm run build:css
*/
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        "vitality-teal": "#02838D",
        "header-black": "#000000",
        "surface-cream": "#FBF5ED",
        "on-primary": "#ffffff",
        primary: "#000000",
        "surface-container-lowest": "#ffffff",
        "border-subtle": "#E0EDEF",
        "on-surface": "#1d1b17",
        "on-surface-variant": "#54646E",
        "surface-lowest": "#ffffff",
        "surface-container-low": "#F9FBFB",
        "surface-container": "#F4F7F7",
        "surface-container-high": "#EDF2F3",
        "surface-container-highest": "#E6EDEE",
      },
      spacing: {
        gutter: "24px",
        "section-gap": "80px",
        "margin-mobile": "20px",
      },
      maxWidth: {
        "container-max": "1200px",
      },
      fontFamily: {
        "display-lg": ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        "display-lg-mobile": ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        "display-md": ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        "headline-md": ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        "body-lg": ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        "body-md": ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        "label-bold": ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["52px", { lineHeight: "1.06", letterSpacing: "-0.03em", fontWeight: "900" }],
        "display-lg-mobile": ["34px", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "900" }],
        "display-md": ["40px", { lineHeight: "1.12", letterSpacing: "-0.025em", fontWeight: "800" }],
        "display-sm": ["32px", { lineHeight: "1.18", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-md": ["24px", { lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "700" }],
        "title-lg": ["20px", { lineHeight: "1.35", letterSpacing: "-0.01em", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "1.62" }],
        "body-md": ["16px", { lineHeight: "1.62" }],
        "label-bold": ["14px", { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "700" }],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
