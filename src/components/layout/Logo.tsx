type LogoProps = {
  /** Width and height of the mark, in pixels. */
  size?: number;
  /** Render the wordmark beside the mark. */
  showText?: boolean;
  label?: string;
  sublabel?: string;
  /** Arabic wordmarks use Tajawal rather than the Latin display serif. */
  locale?: "en" | "ar";
  className?: string;
};

/**
 * Navy square, gold monogram "T" with an inset hairline border,
 * reconstructed from the firm profile cover.
 */
export default function Logo({
  size = 40,
  showText = false,
  label = "TASHEEL LEGAL",
  sublabel,
  locale = "en",
  className = "",
}: LogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-3 transition-[filter] duration-500 ease-smooth hover:drop-shadow-[0_0_15px_rgba(197,168,128,0.5)] ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={label}
        className="shrink-0"
      >
        {/* Navy Background */}
        <rect width="100" height="100" fill="#0A192F" />
        {/* Gold Inner Border */}
        <rect x="6" y="6" width="88" height="88" stroke="#C5A880" strokeWidth="2" />
        {/* The Gold 'T' */}
        <path d="M25 28 H75 M50 28 V78" stroke="#C5A880" strokeWidth="12" strokeLinecap="square" />
      </svg>

      {showText ? (
        <span className="flex min-w-0 flex-col leading-tight">
          <span
            className={
              locale === "ar"
                ? "max-w-[15rem] text-[12px] font-medium leading-snug text-cream md:text-[13px]"
                : "font-serif-en text-[16px] uppercase tracking-[0.16em] text-cream md:text-[17px]"
            }
          >
            {label}
          </span>
          {sublabel ? (
            <span className="mt-1 max-w-[15rem] text-[9px] font-medium uppercase leading-snug tracking-[0.2em] text-gold/85 rtl:tracking-normal rtl:normal-case md:max-w-none md:text-[9.5px]">
              {sublabel}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
