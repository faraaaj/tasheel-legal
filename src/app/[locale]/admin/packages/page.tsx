"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminFetch } from "@/lib/admin-client";

type AdminPackage = {
  id: string;
  name_en: string | null;
  name_ar: string | null;
  price_sar: number | null;
  active: boolean | null;
};

type PackagesResponse = { packages: AdminPackage[] };

export default function AdminPackagesPage() {
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const isAr = locale === "ar";

  const [data, setData] = useState<PackagesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    adminFetch<PackagesResponse>("/api/admin/packages")
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : isAr
                ? "تعذر تحميل الباقات."
                : "Failed to load packages.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAr]);

  const packages = data?.packages ?? [];
  const activeCount = packages.filter((pkg) => pkg.active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A880]">
            {isAr ? "الباقات" : "Packages"}
          </p>
          <h2 className="mt-1 font-serif-en text-2xl text-white">
            {isAr ? "كتالوج الباقات" : "Package catalogue"}
          </h2>
        </div>
        <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">
          {isAr
            ? `${activeCount} نشطة من ${packages.length}`
            : `${activeCount} active of ${packages.length}`}
        </p>
      </div>

      {error && (
        <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <section className="border border-white/10 bg-[#0A1120]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-start text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.14em] text-gray-500">
                <th className="px-5 py-3 text-start font-semibold">
                  {isAr ? "الباقة" : "Package"}
                </th>
                <th className="px-5 py-3 text-start font-semibold">
                  {isAr ? "السعر (ر.س)" : "Price (SAR)"}
                </th>
                <th className="px-5 py-3 text-start font-semibold">
                  {isAr ? "الحالة" : "Status"}
                </th>
              </tr>
            </thead>
            <tbody>
              {!data && !error && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-10 text-center text-gray-400"
                  >
                    {isAr ? "جارٍ التحميل..." : "Loading..."}
                  </td>
                </tr>
              )}

              {packages.map((pkg) => (
                <tr
                  key={pkg.id}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-5 py-3.5">
                    <p className="text-white">
                      {isAr ? pkg.name_ar || pkg.name_en : pkg.name_en}
                    </p>
                    <p
                      className="text-[11px] text-gray-500"
                      dir={isAr ? "ltr" : "rtl"}
                    >
                      {isAr ? pkg.name_en : pkg.name_ar}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-300" dir="ltr">
                    {pkg.price_sar === null
                      ? "—"
                      : pkg.price_sar.toLocaleString("en-US")}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={
                        pkg.active
                          ? "inline-flex border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300"
                          : "inline-flex border border-white/20 bg-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400"
                      }
                    >
                      {pkg.active
                        ? isAr
                          ? "نشطة"
                          : "Active"
                        : isAr
                          ? "غير نشطة"
                          : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-[11px] text-gray-500">
        {isAr
          ? "تحرير الباقات وإضافة باقات جديدة سيُضاف في المرحلة التالية."
          : "Editing packages and adding new ones will be added in the next module."}
      </p>
    </div>
  );
}
