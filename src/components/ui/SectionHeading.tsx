type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  leadClassName?: string;
  id?: string;
  tone?: "light" | "dark";
  align?: "start" | "center";
  className?: string;
};

/**
 * Section masthead: gold eyebrow, display headline, optional lead paragraph.
 * `tone="dark"` is for use on navy backgrounds.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lead,
  leadClassName,
  id,
  tone = "light",
  align = "start",
  className = "",
}: SectionHeadingProps) {
  const dark = tone === "dark";
  const centered = align === "center";

  return (
    <div
      className={`${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}
    >
      <span className={`eyebrow ${centered ? "justify-center" : ""}`}>
        {eyebrow}
      </span>

      <h2
        id={id}
        className={`mt-6 font-serif-en text-[2.2rem] leading-[1.1] tracking-[-0.01em] sm:text-[2.75rem] lg:text-[3.25rem] rtl:text-[1.9rem] rtl:leading-[1.35] ${
          dark ? "text-cream" : "text-navy"
        }`}
      >
        {title}
      </h2>

      {lead ? (
        <p
          className={`mt-6 ${leadClassName ?? `max-w-2xl text-[15px] leading-relaxed rtl:text-base ${dark ? "text-cream/60" : "text-navy/60"}`} ${
            centered ? "mx-auto" : ""
          }`}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
