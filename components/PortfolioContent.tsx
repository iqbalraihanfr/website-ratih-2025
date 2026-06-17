import { createServerSupabase } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import PortfolioCategoryDropdown from "./PortfolioCategoryDropdown";

type PortfolioContentProps = {
  searchParams?: {
    category?: string;
    page?: string;
  };
};

const PAGE_SIZE = 6;

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

const getVisiblePages = (currentPage: number, totalPages: number) => {
  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
};

const PortfolioContent = async ({ searchParams }: PortfolioContentProps) => {
  const supabase = createServerSupabase();

  const selectedCategory = searchParams?.category?.trim() || "";
  const requestedPage = Number(searchParams?.page || "1");
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: categoryRows, error: categoryError } = await supabase
    .from("portfolio")
    .select("category")
    .order("category", { ascending: true });

  if (categoryError) {
    console.error("Error fetching portfolio categories from Supabase:", categoryError);
  }

  const categories = Array.from(
    new Set((categoryRows || []).map((item) => item.category).filter(Boolean))
  );

  const basePortfolioQuery = supabase
    .from("portfolio")
    .select("*", { count: "exact" })
    .order("sort_order", { ascending: true });

  const portfolioQuery = selectedCategory
    ? basePortfolioQuery.eq("category", selectedCategory)
    : basePortfolioQuery;

  const { data: dbPortfolio, error, count } = await portfolioQuery.range(from, to);

  if (error) {
    console.error("Error fetching portfolio from Supabase:", error);
  }

  const displayPortfolio = dbPortfolio || [];
  const totalItems = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const visiblePages = getVisiblePages(currentPage, totalPages);
  const startItem = totalItems === 0 ? 0 : from + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, totalItems);

  return (
    <section className="bg-black px-6 lg:px-20 pt-16 pb-28 min-h-[50vh]">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-yellow-500">
              Filter Kategori
            </p>
            <h2 className="mt-2 text-2xl font-bold italic uppercase text-white md:text-3xl">
              {selectedCategory ? formatCategoryLabel(selectedCategory) : "Semua Portofolio"}
            </h2>
            <p className="mt-2 text-sm text-white/45">
              {totalItems > 0 ? `${startItem}-${endItem} dari ${totalItems} karya` : "Belum ada karya pada kategori ini"}
            </p>
          </div>

          <PortfolioCategoryDropdown categories={categories} selectedCategory={selectedCategory} />
        </div>

        {displayPortfolio.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center border border-white/5 bg-white/[0.01] px-6 py-16 text-center">
            <i className="ri-gallery-line mb-4 block text-5xl text-white/20" />
            <p className="text-lg font-semibold text-white/70">Portofolio tidak ditemukan</p>
            <p className="mt-1 text-sm text-white/40">Coba pilih kategori lain atau kembali ke semua portofolio.</p>
            {selectedCategory && (
              <Link
                href="/portfolio"
                className="mt-6 rounded-full border border-white/10 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white/70 transition-colors hover:border-yellow-500/40 hover:text-yellow-500"
              >
                Lihat Semua
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {displayPortfolio.map((item, i) => {
              const wide = i % 4 === 0 || i % 4 === 3;
              return (
                <article
                  key={item.id}
                  className={`group relative overflow-hidden cursor-pointer ${wide ? "lg:col-span-2" : ""}`}
                  style={{ aspectRatio: wide ? "16 / 9" : "4 / 5" }}
                >
                  <Image
                    src={item.img_url}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-30"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-6 transition-colors group-hover:from-black/75">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500">
                      {item.category} · {new Date(item.created_at || "").getFullYear() || 2025}
                    </p>
                    <h3 className="mt-1.5 text-2xl md:text-3xl font-bold italic uppercase leading-none text-white">
                      {item.title}
                    </h3>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-[11px] uppercase tracking-wider text-white/40">
              Halaman {currentPage} dari {totalPages}
            </p>

            <div className="flex items-center gap-1.5">
              <Link
                href={getPageHref(Math.max(1, currentPage - 1), selectedCategory)}
                aria-disabled={currentPage === 1}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  currentPage === 1
                    ? "pointer-events-none border-white/10 text-white/25"
                    : "border-white/10 text-white/65 hover:border-yellow-500/40 hover:text-yellow-500"
                }`}
                aria-label="Halaman sebelumnya"
              >
                <i className="ri-arrow-left-s-line text-lg" />
              </Link>

              {visiblePages.map((page, index) => {
                const previousPage = visiblePages[index - 1];
                const showGap = previousPage && page - previousPage > 1;

                return (
                  <div key={page} className="flex items-center gap-1.5">
                    {showGap && <span className="px-1 text-xs text-white/30">...</span>}
                    <Link
                      href={getPageHref(page, selectedCategory)}
                      className={`flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-xs font-bold transition-colors ${
                        currentPage === page
                          ? "border-yellow-500 bg-yellow-500 text-black"
                          : "border-white/10 text-white/65 hover:border-yellow-500/40 hover:text-yellow-500"
                      }`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </Link>
                  </div>
                );
              })}

              <Link
                href={getPageHref(Math.min(totalPages, currentPage + 1), selectedCategory)}
                aria-disabled={currentPage === totalPages}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  currentPage === totalPages
                    ? "pointer-events-none border-white/10 text-white/25"
                    : "border-white/10 text-white/65 hover:border-yellow-500/40 hover:text-yellow-500"
                }`}
                aria-label="Halaman berikutnya"
              >
                <i className="ri-arrow-right-s-line text-lg" />
              </Link>
            </div>
          </nav>
        )}
      </div>
    </section>
  );
};

export default PortfolioContent;
