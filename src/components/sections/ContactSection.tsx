"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Check,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { Dictionary, Locale } from "@/lib/dictionaries";

type ContactSectionProps = {
  locale: Locale;
  dict: Dictionary;
};

export default function ContactSection({ locale, dict }: ContactSectionProps) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copy = dict.contact;

  const telHref = `tel:${copy.phone.replace(/[^\d+]/g, "")}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    copy.address,
  )}`;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    copy.address,
  )}&z=15&output=embed`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !subject || !message) {
      setError(copy.form.required);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError(copy.form.invalidEmail);
      return;
    }

    // No backend is connected yet: the request is acknowledged locally.
    setError(null);
    setSent(true);
    form.reset();
  }

  return (
    <section id="contact" className="bg-[#FAF9F6] py-20 scroll-mt-24 lg:py-28">
      <div className="shell">
        {/* Section heading spans the full width so both columns start
            at the exact same vertical position */}
        <span className="eyebrow">{copy.eyebrow}</span>
        <h2 className="mt-6 font-serif-en text-[2.2rem] leading-[1.1] text-navy sm:text-[2.75rem] rtl:text-[1.9rem] rtl:leading-[1.4]">
          {copy.headline}
        </h2>
        <p className="mt-5 max-w-xl text-[15px] leading-[1.85] text-navy/60 rtl:text-base rtl:leading-[1.95]">
          {copy.subtext}
        </p>
        <p className="mt-4 max-w-2xl text-[14px] font-semibold leading-[1.75] text-[#C5A880]">
          {copy.freeConsultNotice}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-12 items-stretch lg:grid-cols-2">
          {/* Form Column */}
          <div className="flex h-full flex-col bg-white p-8 lg:p-10 border border-gray-100 shadow-sm">
            {sent ? (
              <div className="flex min-h-[420px] flex-col items-start justify-center">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/50 text-gold">
                  <Check size={20} strokeWidth={2} />
                </span>
                <p
                  role="status"
                  className="mt-6 max-w-md font-serif-en text-[1.4rem] leading-[1.45] text-navy rtl:font-sans-ar rtl:text-[1.15rem] rtl:leading-[1.8]"
                >
                  {copy.form.success}
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-8 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-navy/45 transition-colors hover:text-gold rtl:tracking-normal rtl:normal-case rtl:text-xs"
                >
                  {copy.form.submit}
                  <ArrowUpRight size={13} className="rtl:-scale-x-100" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-navy/45 rtl:tracking-normal rtl:normal-case rtl:text-[11px]">
                      {copy.form.name}
                    </span>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="field mt-2"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-navy/45 rtl:tracking-normal rtl:normal-case rtl:text-[11px]">
                      {copy.form.email}
                    </span>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      dir="ltr"
                      autoComplete="email"
                      required
                      className="field mt-2"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-navy/45 rtl:tracking-normal rtl:normal-case rtl:text-[11px]">
                    {copy.form.subject}
                  </span>
                  <select
                    id="contact-subject"
                    name="subject"
                    defaultValue=""
                    required
                    className="field mt-2"
                  >
                    <option value="" disabled>
                      {copy.form.subjectPlaceholder}
                    </option>
                    {dict.practiceAreas.items.map((area) => (
                      <option key={area.id} value={area.title}>
                        {area.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-navy/45 rtl:tracking-normal rtl:normal-case rtl:text-[11px]">
                    {copy.form.message}
                  </span>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    className="field mt-2 resize-none"
                  />
                </label>

                {error ? (
                  <p role="alert" className="text-xs text-[#9c3b2e]">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="btn w-full bg-yellow-400 text-[#070D19] hover:bg-yellow-500 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                >
                  {copy.form.submit}
                </button>

                <p className="text-[11px] leading-relaxed text-navy/40">
                  {copy.form.hint}
                </p>
              </form>
            )}
          </div>

          {/* Address Column */}
          <div className="flex h-full flex-col pt-2">
            <dl className="grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center border border-navy/10 text-gold">
                  <MapPin size={15} />
                </span>
                <div>
                  <dt className="text-[9px] font-semibold uppercase tracking-[0.2em] text-navy/40 rtl:tracking-normal rtl:normal-case rtl:text-[11px]">
                    {copy.addressLabel}
                  </dt>
                  <dd className="mt-1.5 text-[13px] leading-relaxed text-navy/75">
                    {copy.address}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center border border-navy/10 text-gold">
                  <Phone size={15} />
                </span>
                <div>
                  <dt className="text-[9px] font-semibold uppercase tracking-[0.2em] text-navy/40 rtl:tracking-normal rtl:normal-case rtl:text-[11px]">
                    {copy.phoneLabel}
                  </dt>
                  <dd className="mt-1.5 text-[13px] text-navy/75">
                    <a
                      href={telHref}
                      dir="ltr"
                      className="transition-colors hover:text-gold"
                    >
                      {copy.phone}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center border border-navy/10 text-gold">
                  <Mail size={15} />
                </span>
                <div>
                  <dt className="text-[9px] font-semibold uppercase tracking-[0.2em] text-navy/40 rtl:tracking-normal rtl:normal-case rtl:text-[11px]">
                    {copy.emailLabel}
                  </dt>
                  <dd className="mt-1.5 text-[13px] text-navy/75">
                    <a
                      href={`mailto:${copy.email}`}
                      dir="ltr"
                      className="transition-colors hover:text-gold"
                    >
                      {copy.email}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center border border-navy/10 text-gold">
                  <Clock size={15} />
                </span>
                <div>
                  <dt className="text-[9px] font-semibold uppercase tracking-[0.2em] text-navy/40 rtl:tracking-normal rtl:normal-case rtl:text-[11px]">
                    {copy.hoursLabel}
                  </dt>
                  <dd className="mt-1.5 text-[13px] leading-relaxed text-navy/75">
                    {copy.hours}
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-10 border border-navy/10 bg-white p-2">
              <iframe
                title={copy.mapLabel}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-60 w-full grayscale-[35%]"
              />
            </div>
            <a
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-navy/45 transition-colors hover:text-gold rtl:tracking-normal rtl:normal-case rtl:text-xs"
            >
              {copy.mapLabel}
              <ArrowUpRight size={13} className="rtl:-scale-x-100" />
            </a>
          </div>
        </div>

        <p className="mt-12 text-[11px] leading-relaxed text-navy/40">
          {dict.footer.disclaimer}
        </p>
      </div>
    </section>
  );
}
