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
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = dict.contact;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("access_key", "8c9c78fe-dd3a-4b2b-82b6-5b3363bfcf5a");
    formData.append("subject", "New Consultation Request - Tasheel Legal");
    formData.append("from_name", "Tasheel Legal Website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(
          locale === "ar"
            ? "حدث خطأ. يرجى المحاولة مرة أخرى."
            : "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      alert(
        locale === "ar"
          ? "حدث خطأ. يرجى التواصل عبر واتساب."
          : "Error sending message. Please try WhatsApp instead."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const expertiseOptions = [
    { value: "", label: locale === "ar" ? "اختر التخصص" : "Select Expertise" },
    { value: "Corporate Law", label: locale === "ar" ? "قانون الشركات" : "Corporate Law" },
    { value: "Commercial Disputes", label: locale === "ar" ? "المنازعات التجارية" : "Commercial Disputes" },
    { value: "Real Estate", label: locale === "ar" ? "العقارات" : "Real Estate" },
    { value: "Labor Law", label: locale === "ar" ? "قانون العمل" : "Labor Law" },
    { value: "Family Law", label: locale === "ar" ? "قانون الأسرة" : "Family Law" },
    { value: "Criminal Defense", label: locale === "ar" ? "الدفاع عن النفس" : "Criminal Defense" },
    { value: "Immigration", label: locale === "ar" ? "الهجرة" : "Immigration" },
    { value: "Intellectual Property", label: locale === "ar" ? "الملكية الفكرية" : "Intellectual Property" },
    { value: "Tax Law", label: locale === "ar" ? "قانون الضرائب" : "Tax Law" },
    { value: "Waqf Planning", label: locale === "ar" ? "هيكلة الوقف" : "Waqf Planning" },
    { value: "Endowment Management", label: locale === "ar" ? "إدارة الأوقاف" : "Endowment Management" },
    { value: "Non-Profit", label: locale === "ar" ? "المنظمات غير الربحية" : "Non-Profit" },
    { value: "Partnership", label: locale === "ar" ? "شراكة" : "Partnership" },
    { value: "Joint Venture", label: locale === "ar" ? "المشاريع المشتركة" : "Joint Venture" },
    { value: "Merger & Acquisition", label: locale === "ar" ? "الاندماج والاستحواذ" : "Merger & Acquisition" },
    { value: "Corporate Governance", label: locale === "ar" ? "حوكمة الشركات" : "Corporate Governance" },
    { value: "ESG", label: locale === "ar" ? "الاستدامة البيئية والاجتماعية والحوكمة" : "ESG" },
  ];

  return (
    <section id="contact" className="bg-[#FAF9F6] py-20 scroll-mt-24 lg:py-28">
      <div className="shell">
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
            {submitted ? (
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
                  onClick={() => setSubmitted(false)}
                  className="mt-8 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-navy/45 transition-colors hover:text-gold rtl:tracking-normal rtl:normal-case rtl:text-xs"
                >
                  {locale === "ar" ? "إرسال رسالة أخرى" : "Send another message"}
                  <ArrowUpRight size={13} className="rtl:-scale-x-100" />
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === "ar" ? "الاسم الكامل" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full border border-gray-300 p-4 focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === "ar" ? "البريد الإلكتروني" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full border border-gray-300 p-4 focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === "ar" ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full border border-gray-300 p-4 focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                </div>

                {/* Expertise Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === "ar" ? "نوع الاستشارة" : "Type of Consultation"}
                  </label>
                  <select
                    name="expertise"
                    className="w-full border border-gray-300 p-4 focus:outline-none focus:border-[#C5A880] transition-colors bg-white"
                  >
                    {expertiseOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === "ar" ? "رسالتك" : "Your Message"}
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    className="w-full border border-gray-300 p-4 focus:outline-none focus:border-[#C5A880] resize-none transition-colors"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-400 text-[#070D19] font-bold uppercase tracking-widest text-[11px] py-4 px-8 transition-all duration-300 hover:bg-yellow-500 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? locale === "ar"
                      ? "جاري الإرسال..."
                      : "Sending..."
                    : locale === "ar"
                    ? "أرسل"
                    : "Send"}
                </button>
              </form>
            )}
            
            {/* WhatsApp Alternative */}
            <div className="mt-8 flex flex-col items-center gap-4 border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                {locale === "ar" ? "أو تواصل معنا مباشرة" : "Or contact us directly"}
              </p>
              <button
                type="button"
                onClick={() => {
                  const form = document.querySelector('form') as HTMLFormElement;
                  const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value || '';
                  const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value || '';
                  const phone = (form.querySelector('[name="phone"]') as HTMLInputElement)?.value || '';
                  const expertise = (form.querySelector('[name="expertise"]') as HTMLSelectElement)?.value || '';
                  
                  const text = `Hello Tasheel Legal,%0A%0AName: ${name}%0AEmail: ${email}%0APhone: ${phone}%0AExpertise: ${expertise}`;
                  window.open(`https://wa.me/966590964157?text=${text}`, '_blank');
                }}
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-4 px-8 transition-all hover:bg-[#128C7E] uppercase tracking-widest text-[11px]"
              >
                {locale === "ar" ? "تواصل عبر واتساب" : "Message on WhatsApp"}
              </button>
            </div>
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
                      href={`tel:${copy.phone.replace(/[^\d+]/g, "")}`}
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
                src={`https://www.google.com/maps?q=${encodeURIComponent(copy.address)}&z=15&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-60 w-full grayscale-[35%]"
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(copy.address)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-navy/45 transition-colors hover:text-gold rtl:tracking-normal rtl:normal-case rtl:text-xs"
            >
              {copy.mapLabel}
              <ArrowUpRight size={13} className="rtl:-scale-x-100" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}