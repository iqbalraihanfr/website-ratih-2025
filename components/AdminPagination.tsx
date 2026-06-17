"use client";

interface AdminPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function AdminPagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
}: AdminPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems <= pageSize) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-white/5 bg-black/20">
      <span className="text-[11px] uppercase tracking-wider text-white/40">
        {startItem}-{endItem} dari {totalItems}
      </span>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] text-white/60 hover:text-yellow-500 hover:border-yellow-500/30 disabled:opacity-30 disabled:hover:text-white/60 disabled:hover:border-white/10 transition-colors cursor-pointer disabled:cursor-not-allowed"
          aria-label="Halaman sebelumnya"
        >
          <i className="ri-arrow-left-s-line text-lg" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`min-w-8 h-8 px-2 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
              currentPage === page
                ? "border-yellow-500 bg-yellow-500 text-black"
                : "border-white/10 bg-white/[0.02] text-white/60 hover:text-yellow-500 hover:border-yellow-500/30"
            }`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] text-white/60 hover:text-yellow-500 hover:border-yellow-500/30 disabled:opacity-30 disabled:hover:text-white/60 disabled:hover:border-white/10 transition-colors cursor-pointer disabled:cursor-not-allowed"
          aria-label="Halaman berikutnya"
        >
          <i className="ri-arrow-right-s-line text-lg" />
        </button>
      </div>
    </div>
  );
}
