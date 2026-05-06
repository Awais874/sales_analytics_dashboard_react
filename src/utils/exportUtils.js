/* ── CSV Export ────────────────────────────────────────────────────── */
export const exportToCSV = (data) => {
  if (!data?.length) return;

  const headers = ["Order ID", "Order Date", "Region", "Category", "Sub-Category", "Sales"];
  const rows    = data.map((row) =>
    headers.map((h) => {
      const val = row[h] ?? "";
      // wrap in quotes if value contains comma or quote
      const str = String(val).replace(/"/g, '""');
      return str.includes(",") || str.includes('"') ? `"${str}"` : str;
    }).join(",")
  );

  const csv  = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `sales_export_${datestamp()}.csv`);
};

/* ── PDF Export ────────────────────────────────────────────────────── */
export const exportToPDF = (kpis, data) => {
  if (!kpis) return;

  // build a minimal printable HTML page and open it in a new tab
  const rows = data.slice(0, 50).map((row) => `
    <tr>
      <td>${row["Order ID"] ?? ""}</td>
      <td>${row["Order Date"] ?? ""}</td>
      <td>${row["Region"] ?? ""}</td>
      <td>${row["Category"] ?? ""}</td>
      <td>${row["Sub-Category"] ?? ""}</td>
      <td style="text-align:right">$${Number(row["Sales"] || 0).toLocaleString()}</td>
    </tr>
  `).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Sales Analytics Report</title>
  <style>
    body { font-family: system-ui, sans-serif; color: #0f172a; padding: 32px; }
    h1   { font-size: 22px; margin-bottom: 4px; }
    p.sub{ color: #64748b; font-size: 13px; margin-bottom: 24px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 28px; }
    .kpi { background: #f8fafc; border-radius: 10px; padding: 14px 16px; }
    .kpi-val { font-size: 22px; font-weight: 700; }
    .kpi-lbl { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: .05em; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #f1f5f9; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b; }
    td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; }
    h2 { font-size: 15px; margin: 24px 0 10px; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <h1>Sales Analytics Report</h1>
  <p class="sub">Generated ${new Date().toLocaleString()} &mdash; ${data.length.toLocaleString()} records</p>

  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-val">$${kpis.totalRevenue?.toLocaleString()}</div><div class="kpi-lbl">Total Revenue</div></div>
    <div class="kpi"><div class="kpi-val">${kpis.totalOrders?.toLocaleString()}</div><div class="kpi-lbl">Total Orders</div></div>
    <div class="kpi"><div class="kpi-val">$${kpis.avgOrderValue?.toLocaleString()}</div><div class="kpi-lbl">Avg Order Value</div></div>
    <div class="kpi"><div class="kpi-val">$${kpis.totalProfit?.toLocaleString()}</div><div class="kpi-lbl">Est. Profit</div></div>
    <div class="kpi"><div class="kpi-val">${kpis.avgMargin}%</div><div class="kpi-lbl">Avg Margin</div></div>
    <div class="kpi"><div class="kpi-val">${kpis.topCategory}</div><div class="kpi-lbl">Top Category</div></div>
  </div>

  <h2>Sales Records (first 50 rows)</h2>
  <table>
    <thead>
      <tr>
        <th>Order ID</th><th>Date</th><th>Region</th>
        <th>Category</th><th>Sub-Category</th><th style="text-align:right">Sales</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <script>window.onload = () => window.print();<\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, "_blank");
  if (win) win.focus();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};

/* ── Helpers ───────────────────────────────────────────────────────── */
function triggerDownload(blob, filename) {
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function datestamp() {
  return new Date().toISOString().slice(0, 10);
}
