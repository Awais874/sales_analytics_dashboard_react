import { useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  LabelList,
} from "recharts";

const SEGMENT_COLORS = {
  "High Value":   "#6366f1",
  "Mid Value":    "#06b6d4",
  "Low Value":    "#10b981",
  "At Risk":      "#ef4444",
};

const MARGIN_BY_CAT = {
  technology:        0.17,
  furniture:         0.04,
  "office supplies": 0.12,
};

function segmentCustomer(totalSpend, orderCount) {
  if (totalSpend > 3000)               return "High Value";
  if (totalSpend > 1000)               return "Mid Value";
  if (orderCount === 1 && totalSpend < 200) return "At Risk";
  return "Low Value";
}

function CustomScatterTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{d.customerId}</p>
      <p className="chart-tooltip__row" style={{ color: SEGMENT_COLORS[d.segment] }}>
        {d.segment}
      </p>
      <p className="chart-tooltip__pct">Orders: {d.orders}</p>
      <p className="chart-tooltip__pct">Spend: ${d.spend.toLocaleString()}</p>
      <p className="chart-tooltip__pct">Avg: ${Math.round(d.spend / d.orders).toLocaleString()}</p>
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="seg-stat">
      <div className="seg-stat__val">{value}</div>
      <div className="seg-stat__lbl">{label}</div>
      {sub && <div className="seg-stat__sub">{sub}</div>}
    </div>
  );
}

function Segmentation({ data }) {
  const [activeSegment, setActiveSegment] = useState(null);
  const [view, setView] = useState("scatter");

  /* ── Build customer profiles ── */
  const { customers, segments, catBreakdown, regionBreakdown, summary } = useMemo(() => {
    const customerMap = {};

    data.forEach((row) => {
      const id     = row["Customer ID"] || row["Order ID"] || "Unknown";
      const name   = row["Customer Name"] || id;
      const spend  = parseFloat(row["Sales"]) || 0;
      const cat    = row["Category"]?.toLowerCase() ?? "other";
      const region = row["Region"] ?? "Unknown";
      const profit = spend * (MARGIN_BY_CAT[cat] ?? 0.1);

      if (!customerMap[id]) {
        customerMap[id] = { customerId: name, orders: 0, spend: 0, profit: 0, region, cats: {} };
      }
      customerMap[id].orders += 1;
      customerMap[id].spend  += spend;
      customerMap[id].profit += profit;
      customerMap[id].cats[cat] = (customerMap[id].cats[cat] || 0) + spend;
    });

    const customers = Object.values(customerMap).map((c) => ({
      ...c,
      spend:   Math.round(c.spend),
      profit:  Math.round(c.profit),
      segment: segmentCustomer(c.spend, c.orders),
      topCat:  Object.entries(c.cats).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—",
    }));

    /* segment summary */
    const segments = Object.entries(
      customers.reduce((acc, c) => {
        if (!acc[c.segment]) acc[c.segment] = { segment: c.segment, count: 0, revenue: 0, profit: 0 };
        acc[c.segment].count   += 1;
        acc[c.segment].revenue += c.spend;
        acc[c.segment].profit  += c.profit;
        return acc;
      }, {})
    )
      .map(([, v]) => ({ ...v, revenue: Math.round(v.revenue), profit: Math.round(v.profit) }))
      .sort((a, b) => b.revenue - a.revenue);

    /* category breakdown */
    const catMap = {};
    data.forEach((row) => {
      const cat   = row["Category"] ?? "Unknown";
      const spend = parseFloat(row["Sales"]) || 0;
      catMap[cat] = (catMap[cat] || 0) + spend;
    });
    const catBreakdown = Object.entries(catMap)
      .map(([cat, val]) => ({ cat, val: Math.round(val) }))
      .sort((a, b) => b.val - a.val);

    /* region breakdown */
    const regMap = {};
    data.forEach((row) => {
      const reg   = row["Region"] ?? "Unknown";
      const spend = parseFloat(row["Sales"]) || 0;
      regMap[reg] = (regMap[reg] || 0) + spend;
    });
    const regionBreakdown = Object.entries(regMap)
      .map(([region, val]) => ({ region, val: Math.round(val) }))
      .sort((a, b) => b.val - a.val);

    const totalRevenue  = customers.reduce((s, c) => s + c.spend, 0);
    const totalProfit   = customers.reduce((s, c) => s + c.profit, 0);
    const highValue     = customers.filter((c) => c.segment === "High Value");
    const atRisk        = customers.filter((c) => c.segment === "At Risk");

    const summary = {
      totalCustomers: customers.length,
      totalRevenue:   Math.round(totalRevenue),
      totalProfit:    Math.round(totalProfit),
      avgSpend:       customers.length ? Math.round(totalRevenue / customers.length) : 0,
      highValueCount: highValue.length,
      highValueRev:   Math.round(highValue.reduce((s, c) => s + c.spend, 0)),
      atRiskCount:    atRisk.length,
    };

    return { customers, segments, catBreakdown, regionBreakdown, summary };
  }, [data]);

  const visibleDots = activeSegment
    ? customers.filter((c) => c.segment === activeSegment)
    : customers;

  const fmtK = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;

  return (
    <div className="segmentation">

      {/* ── Summary stats ── */}
      <div className="seg-stats-grid">
        <StatCard label="Total Customers"  value={summary.totalCustomers.toLocaleString()} />
        <StatCard label="Total Revenue"    value={fmtK(summary.totalRevenue)} />
        <StatCard label="Avg Spend"        value={fmtK(summary.avgSpend)} sub="per customer" />
        <StatCard label="High Value"       value={summary.highValueCount} sub={fmtK(summary.highValueRev) + " revenue"} />
        <StatCard label="At Risk"          value={summary.atRiskCount} sub="1 order, low spend" />
        <StatCard label="Est. Profit"      value={fmtK(summary.totalProfit)} />
      </div>

      {/* ── Segment pills ── */}
      <div className="seg-pills">
        <button
          className={`seg-pill${!activeSegment ? " seg-pill--all" : ""}`}
          onClick={() => setActiveSegment(null)}
        >
          All
        </button>
        {segments.map((s) => (
          <button
            key={s.segment}
            className={`seg-pill${activeSegment === s.segment ? " seg-pill--active" : ""}`}
            style={activeSegment === s.segment ? { borderColor: SEGMENT_COLORS[s.segment], color: SEGMENT_COLORS[s.segment] } : {}}
            onClick={() => setActiveSegment((p) => p === s.segment ? null : s.segment)}
          >
            <span className="seg-pill__dot" style={{ background: SEGMENT_COLORS[s.segment] }} />
            {s.segment} ({s.count})
          </button>
        ))}
      </div>

      {/* ── Segment breakdown cards ── */}
      <div className="seg-cards">
        {segments.map((s) => {
          const pct = summary.totalRevenue > 0
            ? ((s.revenue / summary.totalRevenue) * 100).toFixed(1)
            : "0.0";
          const isActive = !activeSegment || activeSegment === s.segment;
          return (
            <div
              key={s.segment}
              className={`seg-card${!isActive ? " seg-card--faded" : ""}`}
              style={{ borderTop: `3px solid ${SEGMENT_COLORS[s.segment]}` }}
              onClick={() => setActiveSegment((p) => p === s.segment ? null : s.segment)}
            >
              <div className="seg-card__name" style={{ color: SEGMENT_COLORS[s.segment] }}>
                {s.segment}
              </div>
              <div className="seg-card__val">{fmtK(s.revenue)}</div>
              <div className="seg-card__meta">{s.count} customers · {pct}% of revenue</div>
              <div className="seg-card__profit">Profit: {fmtK(s.profit)}</div>
            </div>
          );
        })}
      </div>

      {/* ── Chart toggle ── */}
      <div className="seg-chart-header">
        <span className="seg-chart-title">
          {view === "scatter" ? "Spend vs Orders (per customer)" : "Revenue by Category & Region"}
        </span>
        <div className="chart-toggle-group">
          <button className={`chart-toggle-btn${view === "scatter" ? " active" : ""}`} onClick={() => setView("scatter")}>Scatter</button>
          <button className={`chart-toggle-btn${view === "bar"     ? " active" : ""}`} onClick={() => setView("bar")}>Breakdown</button>
        </div>
      </div>

      {/* ── Scatter plot ── */}
      {view === "scatter" && (
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 4" />
            <XAxis
              dataKey="orders"
              name="Orders"
              label={{ value: "Orders", position: "insideBottom", offset: -4, fontSize: 11, fill: "#94a3b8" }}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              dataKey="spend"
              name="Spend"
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false} tickLine={false}
              width={54}
            />
            <Tooltip content={<CustomScatterTooltip />} />
            <Scatter data={visibleDots} isAnimationActive>
              {visibleDots.map((c, i) => (
                <Cell
                  key={i}
                  fill={SEGMENT_COLORS[c.segment]}
                  opacity={0.75}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      )}

      {/* ── Bar breakdown ── */}
      {view === "bar" && (
        <div className="seg-bar-row">
          <div className="seg-bar-col">
            <p className="seg-bar-label">By Category</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={catBreakdown} layout="vertical" margin={{ left: 10, right: 40, top: 5, bottom: 5 }}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 4" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="cat" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip formatter={(v) => [`$${Math.round(v).toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="val" radius={[0, 5, 5, 0]} fill="#6366f1">
                  <LabelList dataKey="val" position="right" formatter={(v) => `$${(v/1000).toFixed(0)}k`} style={{ fontSize: 10, fill: "#64748b" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="seg-bar-col">
            <p className="seg-bar-label">By Region</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={regionBreakdown} layout="vertical" margin={{ left: 10, right: 40, top: 5, bottom: 5 }}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 4" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="region" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip formatter={(v) => [`$${Math.round(v).toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="val" radius={[0, 5, 5, 0]} fill="#06b6d4">
                  <LabelList dataKey="val" position="right" formatter={(v) => `$${(v/1000).toFixed(0)}k`} style={{ fontSize: 10, fill: "#64748b" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Top customers table ── */}
      <div className="seg-table-wrap">
        <p className="seg-bar-label" style={{ marginBottom: 8 }}>
          Top customers {activeSegment ? `· ${activeSegment}` : ""}
        </p>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ minWidth: 500 }}>
            <thead>
              <tr>
                <th className="data-table__th">Customer</th>
                <th className="data-table__th">Segment</th>
                <th className="data-table__th">Region</th>
                <th className="data-table__th">Top Category</th>
                <th className="data-table__th data-table__th--right">Orders</th>
                <th className="data-table__th data-table__th--right">Revenue</th>
                <th className="data-table__th data-table__th--right">Est. Profit</th>
              </tr>
            </thead>
            <tbody>
              {(activeSegment
                ? customers.filter((c) => c.segment === activeSegment)
                : customers
              )
                .sort((a, b) => b.spend - a.spend)
                .slice(0, 12)
                .map((c, i) => (
                  <tr key={i} className="data-table__row">
                    <td className="data-table__td td--strong">{c.customerId}</td>
                    <td className="data-table__td">
                      <span className="seg-badge" style={{
                        background: SEGMENT_COLORS[c.segment] + "22",
                        color: SEGMENT_COLORS[c.segment],
                      }}>
                        {c.segment}
                      </span>
                    </td>
                    <td className="data-table__td td--muted">{c.region}</td>
                    <td className="data-table__td td--muted" style={{ textTransform: "capitalize" }}>{c.topCat}</td>
                    <td className="data-table__td td--number">{c.orders}</td>
                    <td className="data-table__td td--number">${c.spend.toLocaleString()}</td>
                    <td className="data-table__td td--number td--profit">${c.profit.toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Segmentation;
