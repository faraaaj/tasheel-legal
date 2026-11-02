# Tasheel Legal — website

Bilingual (English / Arabic) marketing site for **TASHEEL LEGAL** — شركة تسهيل
للمحاماة والاستشارات القانونية. Next.js 15 (App Router) + TypeScript + Tailwind,
running on **port 7001**.

## Run

```bash
npm install
npm run dev     # http://localhost:7001  (redirects to /en or /ar by browser language)
npm run build
npm start       # production server on port 7001
```

## Structure

```
src/
  app/
    globals.css              Tailwind layers, design tokens, shared classes
    [locale]/
      layout.tsx             <html lang dir>, fonts, header/footer, metadata
      page.tsx               home: hero -> values -> firm -> practice -> method
                             -> team -> insights -> contact
      contact/page.tsx       dedicated contact route
  components/
    layout/
      Header.tsx             fixed header, scroll state, language pill, mobile menu
      Footer.tsx             4 columns + 4 registrations + disclaimer
      Logo.tsx               gold monogram, optional wordmark (EN or AR label)
    sections/
      Hero.tsx               split hero, staggered entrance
      CoreValues.tsx         4 principles in a hairline grid
      AboutFirm.tsx          pull-quote + firm narrative + credentials
      PracticeAreas.tsx      9 disciplines, sticky sidebar, scroll-spy
      Methodology.tsx        5 steps with scroll-linked gold progress line
      Team.tsx               3 role cards (no invented names)
      Insights.tsx           3 commentary cards
      ContactSection.tsx     form (9-area subject), details, map, success state
    ui/
      Button.tsx             shared CTA (link or button)
      SectionHeading.tsx     eyebrow / headline / lead
      Reveal.tsx             scroll-triggered fade-up wrapper
  dictionaries/
    types.ts                 Dictionary interface
    en.ts                    all English copy
    ar.ts                    all Arabic copy (same shape, type-checked)
  lib/
    dictionaries.ts          locale list, direction, typed lookup
    fonts.ts                 self-hosted Cormorant Garamond, Inter, Tajawal
  fonts/                     woff2 subsets served by next/font/local
  middleware.ts              redirects "/" to the preferred locale
tailwind.config.ts           navy / gold / cream palette, font families
```

## Bilingual model

- Two locales only: `en` and `ar`, served under `/en` and `/ar`.
- Every string lives in `src/dictionaries/{en,ar}.ts`. Both files implement the
  same `Dictionary` interface, so a missing Arabic key fails `tsc` instead of
  shipping an empty label.
- Direction is handled with `dir="rtl"` on `<html>` plus CSS logical properties
  (`padding-inline`, `border-inline-end`, `inset-inline`), so layouts mirror
  without a second stylesheet.
- Arabic swaps the display serif for Tajawal and removes Latin letter-spacing;
  the header wordmark shows the full legal name rather than a short form.
- The language pill keeps the current path: `/en/contact` <-> `/ar/contact`.

## Design system

| Token | Value |
| --- | --- |
| Navy | `#0A192F` |
| Navy light | `#112240` |
| Gold | `#C5A880` |
| Cream | `#F9F8F6` |

Font families are exposed as `font-serif-en` (Cormorant Garamond),
`font-sans-en` (Inter) and `font-sans-ar` (Tajawal). The woff2 subsets are
committed under `src/fonts` and wired through `next/font/local`, so builds never
depend on the Google Fonts CDN.

## Content rules

- Arabic brand is always written in full: شركة تسهيل للمحاماة والاستشارات
  القانونية. The site uses "Company / شركة", never "Office / مكتب".
- No invented statistics, client names, awards or memberships. Team cards carry
  role titles; metrics are absent by design.
- Footer registrations are taken from the certified firm profile: CR 1010689268,
  Bar 888699, Tax 310873567300003, MoJ 7021598896.

## Notes

- The contact form has **no backend** yet. It validates on the client and shows
  an acknowledgement; nothing is transmitted. Wire it to an API route or the
  firm's CRM before launch.
- Copy still marked for sign-off: phone number, email address, office hours and
  insight articles should be confirmed with the firm before launch.

## Runtime location

`H:\My Drive` is a cloud-backed volume: about **71 ms per file** and
**~165 KB/s** throughput, and it refuses junctions/symlinks. A Next.js install
(~60k files) therefore takes hours there, and every dev compile writes thousands
of files into it.

This project is developed and served from a local NTFS mirror:

```
C:\Users\FARAA\Projects\tasheel-legal      <- runs here (npm run dev, port 7001)
H:\My Drive\ZZ-TASHEEL-LEGAL\tasheel-legal <- canonical source copy
```

Source (everything except `node_modules/`, `.next/`, `*.log`) is synced between
the two. To reproduce on a normal disk elsewhere, copy this folder and run
`npm install && npm run dev`.
