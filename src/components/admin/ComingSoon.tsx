export default function ComingSoon({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A880]">
          {eyebrow}
        </p>
        <h2 className="mt-1 font-serif-en text-2xl text-white">{title}</h2>
      </div>

      <div className="border border-dashed border-white/15 bg-[#0A1120] px-6 py-14 text-center">
        <p className="mx-auto max-w-md text-sm leading-relaxed text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}
