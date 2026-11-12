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
    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 w-[280px]">
      <div className="flex items-center justify-center h-12 bg-gradient-to-r from-[#C5A880] via-[#D4A05A] to-[#B8642A] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] border border-white/20">
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#070D19] whitespace-nowrap">
          {label}
        </span>
        <div className="h-5 w-px bg-[#070D19]/30 mx-3" />
        <div className="flex items-center gap-2">
          {!isFree && (
            <span className="text-[11px] font-medium text-[#070D19]/60 line-through">
              {originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-[15px] font-black text-white">
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
