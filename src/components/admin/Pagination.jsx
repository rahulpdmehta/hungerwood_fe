import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, total);

  const go = (p) => onPageChange(Math.min(Math.max(1, p), totalPages));

  const pages = (() => {
    const out = [];
    const window = 2;
    const push = (v) => out.push(v);
    push(1);
    if (safePage - window > 2) push('…');
    for (let p = Math.max(2, safePage - window); p <= Math.min(totalPages - 1, safePage + window); p++) {
      push(p);
    }
    if (safePage + window < totalPages - 1) push('…');
    if (totalPages > 1) push(totalPages);
    return out;
  })();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-3 text-sm text-gray-700">
      <div className="flex items-center gap-2">
        <span className="text-gray-600">
          {total === 0 ? '0 results' : `Showing ${start}–${end} of ${total}`}
        </span>
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="ml-2 px-2 py-1 border border-gray-300 rounded-md bg-white"
            aria-label="Rows per page"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => go(safePage - 1)}
          disabled={safePage <= 1}
          className="p-1.5 rounded-md border border-gray-300 bg-white disabled:opacity-40 hover:bg-gray-50"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="px-2 text-gray-400">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              className={`min-w-[32px] px-2 py-1 rounded-md border text-sm ${
                p === safePage
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => go(safePage + 1)}
          disabled={safePage >= totalPages}
          className="p-1.5 rounded-md border border-gray-300 bg-white disabled:opacity-40 hover:bg-gray-50"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
