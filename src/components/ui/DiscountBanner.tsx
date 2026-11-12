type DiscountBannerProps = {
  label: string;
  originalPrice: number;
  discountedPrice: number;
  locale: string;
};

export function DiscountBanner({
  label,
  originalPrice,
  discountedPrice,
  locale,
}: DiscountBannerProps) {
  const isFree = discountedPrice === 0;

  return (
    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 w-auto">
      <div className="relative flex items-center gap-4 px-8 py-2.5 bg-gradient-to-r from-[#EAB308] via-[#F97316] to-[#DC2626] shadow-xl rounded-full border-2 border-white/20">
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white whitespace-nowrap">
          {label}
        </span>
        <div className="flex items-center gap-2 pl-4 border-l border-white/30">
          {!isFree && (
            <span className="text-[11px] font-medium text-white/70 line-through decoration-white/50">
              {originalPrice.toLocaleString()} SAR
            </span>
          )}
          <span className="text-[16px] font-black text-white whitespace-nowrap">
            {isFree
              ? locale === "ar"
                ? "مجاناً"
                : "FREE"
              : `${discountedPrice.toLocaleString()} SAR`}
          </span>
        </div>
      </div>
    </div>
  );
}
