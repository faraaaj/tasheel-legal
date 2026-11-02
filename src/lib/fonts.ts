import localFont from "next/font/local";

/**
 * Self-hosted variable/static subsets, downloaded once from Google Fonts and
 * committed under `src/fonts`. Self-hosting keeps `next build` offline and
 * deterministic: the Google CSS2 endpoint occasionally serves Inter in its
 * legacy `/l/font?kit=` form, which `next/font/google` cannot parse.
 *
 * Cormorant Garamond and Inter ship as single variable files. Tajawal is
 * static per weight and split into Arabic + Latin subsets; the Latin instance
 * is used as a second family so numbers and Latin names inside Arabic copy
 * keep the same typeface.
 */

export const cormorant = localFont({
  src: [
    {
      path: "../fonts/cormorant-latin.woff2",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-cormorant",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const inter = localFont({
  src: [
    { path: "../fonts/inter-latin.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const tajawal = localFont({
  src: [
    {
      path: "../fonts/tajawal-400-arabic.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/tajawal-500-arabic.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/tajawal-700-arabic.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-tajawal",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const tajawalLatin = localFont({
  src: [
    { path: "../fonts/tajawal-400-latin.woff2", weight: "400", style: "normal" },
    { path: "../fonts/tajawal-500-latin.woff2", weight: "500", style: "normal" },
    { path: "../fonts/tajawal-700-latin.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-tajawal-latin",
  display: "swap",
  adjustFontFallback: "Arial",
});
