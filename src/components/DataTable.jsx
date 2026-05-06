import { useMemo, useState } from "react";

const REGION_CLASS = {
  West: "badge--west",
  East: "badge--east",
  Central: "badge--central",
  South: "badge--south",
};

const MARGIN_BY_CAT = {
  technology: 0.17,
  furniture: 0.04,
  "office supplies": 0.12,
};

const PAGE_SIZE = 15;

const COLUMNS = [
  { key: "Order ID",      label: "Order ID",      align: "left"  },
  { key: "Order Date",    label: "Date",           align: "left"  },
  { key: "Region",        label: "Region",         align: "left"  },
  { key: "Category",      label: "Category",       align: "left"  },
  { key: "Sub-Category",  label: "Sub-Category",   align: "left"  },
  { key: "Sales",         label: "Sales",          align: "right" },
  { key: "_profit",       label: "Est. Profit",    align: "right" },
  { key: "_margin",       label: "Margin",         align: "right" },
];

function fmt(n) {
  return isNaN(n) ? "—" : `$${Math.round(n).toLocaleString()}`;
}

function SortIcon({ active, dir }) {
  if (!active) return <span className="sort-icon sort-icon--idle">↕</span>;
  return <span className="sort-icon sort-icon--active">{dir === "asc" ? "↑" : "↓"}</span>;
}

function DataTable({ data }) {
  const [sortKey, setSortKey]   = useState("Order Date");
  const [sortDir, setSortDir]   = useState("desc");
  const [page, setPage]         = useState(0);

  const enriched = useMemo(() => data.map((row) => {
    const sales  = parseFloat(row["Sales"]) || 0;
    const cat    = row["Category"]?.toLowerCase() ?? "";
    const margin = MARGIN_BY_CAT[cat] ?? 0.1;
    return { ...row, _sales: sales, _profit: sales * margin, _margin: margin * 100 };
  }), [data]);

  const sorted = useMemo(() => {
    return [...enriched].sort((a, b) => {
      let av = a[sortKey] ?? "";
      let bv = b[sortKey] ?? "";
      if (sortKey === "Sales" || sortKey === "_profit" || sortKey === "_margin") {
        av = parseFloat(av) || 0;
        bv = parseFloat(bv) || 0;
        return sortDir === "asc" ? av - bv : bv - av;
      }
      av = String(av).toLowerCase();
      bv = String(bv).toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ?  1 : -1;
      return 0;
    });
  }, [enriched, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageData   = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  };

  return (
    <div className="data-table-wrap">
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`data-table__th${col.align === "right" ? " data-table__th--right" : ""}`}
                  onClick={() => handleSort(col.key)}
                  aria-sort={sortKey === col.key ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  <span className="th-inner">
                    {col.label}
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pageData.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="data-table__empty">
                  No records match your filters.
                </td>
              </tr>
            )}
            {pageData.map((row, i) => {
              const margin = row._margin;
              const marginColor = margin >= 15 ? "#16a34a" : margin >= 8 ? "#d97706" : "#dc2626";
              return (
                <tr key={`${row["Order ID"]}-${i}`} className="data-table__row">
                  <td className="data-table__td td--id">{row["Order ID"]}</td>
                  <td className="data-table__td td--muted">{row["Order Date"]}</td>
                  <td className="data-table__td">
                    <span className={`region-badge ${REGION_CLASS[row["Region"]] ?? ""}`}>
                      {row["Region"]}
                    </span>
                  </td>
                  <td className="data-table__td td--strong">{row["Category"]}</td>
                  <td className="data-table__td td--muted">{row["Sub-Category"]}</td>
                  <td className="data-table__td td--number">{fmt(row._sales)}</td>
                  <td className="data-table__td td--number td--profit">{fmt(row._profit)}</td>
                  <td className="data-table__td td--number">
                    <span className="margin-badge" style={{ color: marginColor }}>
                      {margin.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="data-table__pagination">
        <span className="pagination__info">
          {sorted.length.toLocaleString()} records &mdash; page {page + 1} of {totalPages}
        </span>
        <div className="pagination__controls">
          <button
            className="pagination__btn"
            onClick={() => setPage(0)}
            disabled={page === 0}
            aria-label="First page"
          >«</button>
          <button
            className="pagination__btn"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous page"
          >‹ Prev</button>
          <button
            className="pagination__btn"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            aria-label="Next page"
          >Next ›</button>
          <button
            className="pagination__btn"
            onClick={() => setPage(totalPages - 1)}
            disabled={page >= totalPages - 1}
            aria-label="Last page"
          >»</button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
