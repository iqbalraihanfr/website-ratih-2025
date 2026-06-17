"use client";

import Link from "next/link";
import { useRef } from "react";

type PortfolioCategoryDropdownProps = {
  categories: string[];
  selectedCategory: string;
};

const formatCategoryLabel = (category: string) =>
  category
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getPageHref = (page: number, category?: string) => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const queryString = params.toString();
  return queryString ? `/portfolio?${queryString}` : "/portfolio";
};

const PortfolioCategoryDropdown = ({
  categories,
  selectedCategory,
}: PortfolioCategoryDropdownProps) => {
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  const closeDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.open = false;
    }
  };

  return (
    <details ref={dropdownRef} className="group relative w-fit">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-yellow-500 [&::-webkit-details-marker]:hidden">
        <span>Kategori</span>
        <span className="text-yellow-500">
          {selectedCategory ? formatCategoryLabel(selectedCategory) : "Semua"}
        </span>
        <i className="ri-arrow-down-s-line text-lg transition-transform group-open:rotate-180" />
      </summary>

      <div className="absolute right-0 z-20 mt-4 min-w-56 border border-white/10 bg-black/95 px-5 py-4 shadow-2xl shadow-black/40">
        <div className="flex flex-col items-start gap-3">
          <Link
            href="/portfolio"
            onClick={closeDropdown}
            className={`text-left text-xs font-bold uppercase tracking-[0.18em] transition-colors ${
              !selectedCategory ? "text-yellow-500" : "text-white/60 hover:text-yellow-500"
            }`}
          >
            Semua
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={getPageHref(1, category)}
              onClick={closeDropdown}
              className={`text-left text-xs font-bold uppercase tracking-[0.18em] transition-colors ${
                selectedCategory === category ? "text-yellow-500" : "text-white/60 hover:text-yellow-500"
              }`}
            >
              {formatCategoryLabel(category)}
            </Link>
          ))}
        </div>
      </div>
    </details>
  );
};

export default PortfolioCategoryDropdown;
