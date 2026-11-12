"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin, Phone, Mail, Clock, Check, Send } from "lucide-react";
import type { Locale } from "@/lib/dictionaries";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  locale?: Locale;
};

const EXPERTISE_OPTIONS = [
  { value: "", label: "" },
  { value: "Corporate Law", label: "Corporate Law" },
  { value: "Commercial Disputes", label: "Commercial Disputes" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Labor Law", label: "Labor Law" },
  { value: "Family Law", label: "Family Law" },
  { value: "Criminal Defense", label: "Criminal Defense" },
  { value: "Immigration", label: "Immigration" },
  { value: "Intellectual Property", label: "Intellectual Property" },
  { value: "Tax Law", label: "Tax Law" },
  { value: "Waqf Planning", label: "Waqf Planning" },
  { value: "Endowment Management", label: "Endowment Management" },
  { value: "Non-Profit", label: "Non-Profit" },
  { value: "Partnership", label: "Partnership" },
  { value: "Joint Venture", label: "Joint Venture" },
  { value: "Merger & Acquisition", label: "Merger & Acquisition" },
  { value: "Corporate Governance", label: "Corporate Governance" },
  { value: "ESG", label: "ESG" },
];

export default function ContactModal({
  isOpen,
  onClose,
  locale = "en",
}: ContactModalProps) {
  const isAr = locale === "ar";
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    expertise: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          expertise: form.expertise,
          message: form.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        alert(isAr ? "حدث خطأ. يرجى المحاولة مرة أخرى." : "Something went wrong. Please try again.");
      }
    } catch {
      alert(isAr ? "حدث خطأ. يرجى التواصل عبر واتساب." : "Error sending message. Please try WhatsApp instead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const text = `Hello Tasheel Legal,%0A%0AName: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0AExpertise: ${form.expertise}`;
    window.open(`https://wa.me/966583331600?text=${text}`, "_blank");
  };

  if (!isOpen) return null;

  const title = isAr ? "تواصل معنا" : "Contact Us";
  const subtitle = isAr
    ? "يسعدنا سماع منظومتك القانونية."
    : "We would be honored to understand your institution's legal posture.";

  const address = isAr
    ? "المملكة العربية السعودية — الرياض"
    : "Riyadh, Saudi Arabia";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070D19]/90 backdrop-blur-xl p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-[95vh] max-w-4xl overflow-hidden bg-[#0A1120] border border-[#C5A880]/30 shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white/70 hover:text-gold transition-colors bg-[#070D19]/50 p-2 rounded-full"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {/* Left Column: Form */}
        <div className="flex h-full flex-col overflow-y-auto scrollbar-hide p-8 md:p-12 md:w-1/2">
          {submitted ? (
            <div className="flex min-h-[420px] flex-col items-start justify-center">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/50 text-gold">
                <Check size={20} strokeWidth={2} />
              </span>
              <p className="mt-6 font-serif-en text-2xl text-white">
                {isAr ? "تم استلام رسالتك." : "Message received."}
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C5A880] hover:text-gold transition-colors"
              >
                {isAr ? "إرسال رسالة أخرى" : "Send another message"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <h2 className="font-serif-en text-3xl text-white">{title}</h2>
              <p className="mt-2 text-sm text-gray-400">{subtitle}</p>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2">
                    {isAr ? "الاسم الكامل" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2">
                    {isAr ? "البريد الإلكتروني" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2">
                    {isAr ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2">
                    {isAr ? "نوع الاستشارة" : "Type of Consultation"}
                  </label>
                  <select
                    value={form.expertise}
                    onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                    className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#C5A880] focus:outline-none"
                  >
                    {EXPERTISE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2">
                    {isAr ? "رسالتك" : "Your Message"}
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#C5A880] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-400 text-[#070D19] font-bold uppercase tracking-widest text-[11px] py-4 px-8 transition-all duration-300 hover:bg-yellow-500 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (isAr ? "جاري الإرسال..." : "Sending...") : isAr ? "أرسل" : "Send"}
                </button>
              </div>
            </form>
          )}

          {/* WhatsApp Alternative */}
          <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/10 pt-6">
            <p className="text-sm text-gray-400 uppercase tracking-wider">
              {isAr ? "أو تواصل معنا مباشرة" : "Or contact us directly"}
            </p>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-4 px-8 transition-all hover:bg-[#128C7E] uppercase tracking-widest text-[11px]"
            >
              {isAr ? "تواصل عبر واتساب" : "Message on WhatsApp"}
            </button>
          </div>
        </div>

        {/* Right Column: Contact Details + Map */}
        <div className="hidden md:flex md:w-1/2 flex-col p-8 md:p-12 overflow-y-auto scrollbar-hide">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center border border-[#C5A880]/40 text-[#C5A880]">
              <MapPin size={15} />
            </span>
            <div>
              <dt className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C5A880]/70">
                {isAr ? "العنوان" : "Address"}
              </dt>
              <dd className="mt-1.5 text-[13px] text-gray-300">{address}</dd>
            </div>
          </div>
          <div className="mt-6 flex items-start gap-3">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center border border-[#C5A880]/40 text-[#C5A880]">
              <Phone size={15} />
            </span>
            <div>
              <dt className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C5A880]/70">
                {isAr ? "الهاتف" : "Phone"}
              </dt>
              <dd className="mt-1.5 text-[13px] text-gray-300" dir="ltr">+966583331600</dd>
            </div>
          </div>
          <div className="mt-6 flex items-start gap-3">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center border border-[#C5A880]/40 text-[#C5A880]">
              <Mail size={15} />
            </span>
            <div>
              <dt className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C5A880]/70">
                {isAr ? "البريد الإلكتروني" : "Email"}
              </dt>
              <dd className="mt-1.5 text-[13px] text-gray-300" dir="ltr">info@tasheel.law</dd>
            </div>
          </div>
          <div className="mt-6 flex items-start gap-3">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center border border-[#C5A880]/40 text-[#C5A880]">
              <Clock size={15} />
            </span>
            <div>
              <dt className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C5A880]/70">
                {isAr ? "المواعيد" : "Hours"}
              </dt>
              <dd className="mt-1.5 text-[13px] text-gray-300">
                {isAr ? "السبت - الخميس: 9:00 ص - 6:00 م" : "Sat – Thu: 9:00 AM – 6:00 PM"}
              </dd>
            </div>
          </div>

          <div className="mt-8 border border-[#C5A880]/20 bg-[#070D19] p-2">
            <iframe
              title={isAr ? "خريطة التواصل" : "Contact Map"}
              src={`https://www.google.com/maps?q=${encodeURIComponent("Riyadh, Saudi Arabia")}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-56 w-full grayscale-[35%]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
