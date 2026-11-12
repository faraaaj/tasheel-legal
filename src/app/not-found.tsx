import Link from "next/link";

// Global 404 for routes that fall outside [locale] (and the build-time
// /_not-found entry). It renders its own document shell because the root
// layout is a pass-through and the locale layout does not apply here.
export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#070D19",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#C5A880",
            }}
          >
            404
          </p>
          <h1 style={{ margin: "16px 0 8px", fontSize: "32px", fontWeight: 600 }}>
            Page not found
          </h1>
          <p style={{ margin: "0 0 8px", color: "#cbd5e1" }}>
            الصفحة غير موجودة
          </p>
          <div
            style={{
              marginTop: "28px",
              display: "flex",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            <Link
              href="/en"
              style={{
                padding: "12px 22px",
                background: "#facc15",
                color: "#070D19",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              English
            </Link>
            <Link
              href="/ar"
              style={{
                padding: "12px 22px",
                border: "1px solid #C5A880",
                color: "#C5A880",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              العربية
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
