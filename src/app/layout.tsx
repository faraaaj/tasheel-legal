import type { ReactNode } from "react";

// Root layout is intentionally a pass-through: the real <html>/<body> shell
// lives in app/[locale]/layout.tsx so that lang/dir can follow the locale.
// This file exists so that app-root routes outside [locale] (e.g. the
// generated /_not-found entry) have a layout to attach to.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
