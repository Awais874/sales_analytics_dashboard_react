import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useMemo, useState } from "react";

const REGION_COLORS = {
  West:    "#06b6d4",
  East:    "#8b5cf6",
  Central: "#10b981",
  South:   "#6366f1",
};
const FALLBACK_COLORS = ["#f59e0b", "#ec4899", "#ef4444", "#64748b"];

function getColor(region, index) {
  return REGION_COLORS[region] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

function CustomTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{name}</p>
      <p className="chart-tooltip__row" style={{ color: payload[0].payload.fill }}>
        ${Math.round(value).toLocaleString()}
      </p>
      <p className="chart-tooltip__pct">{pct}% of total</p>
    </div>
  );
}

function RegionChart({ data }) {
  const [activeRegion, setActiveRegion] = useState(null);

  const { regionSales, total } = useMemo(() => {
    const grouped = data.reduce((acc, row) => {
      const region = row["Region"]?.trim();
      const sales  = parseFloat(row["Sales"]) || 0;
      if (!region) return acc;
      if (!acc[region]) acc[region] = { region, sales: 0 };
      acc[region].sales += sales;
      return acc;
    }, {});

    const arr = Object.values(grouped)
      .map((d, i) => ({
        ...d,
        sales: Math.round(d.sales),
        fill:  getColor(d.region, i),
      }))
      .sort((a, b) => b.sales - a.sales);

    const total = arr.reduce((s, d) => s + d.sales, 0);
    return { regionSales: arr, total };
  }, [data]);

  const handleClick = (_, index) => {
    const region = regionSales[index]?.region;
    setActiveRegion((prev) => (prev === region ? null : region));
  };

  return (
    <div className="region-chart">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={regionSales}
            dataKey="sales"
            nameKey="region"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={58}
            paddingAngle={3}
            onClick={handleClick}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(1)}%`
            }
            labelLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
            isAnimationActive
          >
            {regionSales.map((entry, index) => (
              <Cell
                key={entry.region}
                fill={entry.fill}
                stroke="none"
                opacity={activeRegion && activeRegion !== entry.region ? 0.35 : 1}
                style={{ cursor: "pointer", transition: "opacity 0.2s" }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip total={total} />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Custom legend with values + percentages */}
      <div className="region-legend">
        {regionSales.map((entry) => {
          const pct = total > 0 ? ((entry.sales / total) * 100).toFixed(1) : "0.0";
          const isActive = !activeRegion || activeRegion === entry.region;
          return (
            <button
              key={entry.region}
              className={`region-legend__item${!isActive ? " region-legend__item--faded" : ""}`}
              onClick={() => setActiveRegion((p) => p === entry.region ? null : entry.region)}
              aria-pressed={activeRegion === entry.region}
            >
              <span className="region-legend__swatch" style={{ background: entry.fill }} />
              <span className="region-legend__name">{entry.region}</span>
              <span className="region-legend__val">${(entry.sales / 1000).toFixed(0)}k</span>
              <span className="region-legend__pct">{pct}%</span>
            </button>
          );
        })}
      </div>

      {/* Summary stats row */}
      <div className="region-stats">
        <div className="region-stat">
          <span className="region-stat__val">${(total / 1000).toFixed(0)}k</span>
          <span className="region-stat__lbl">Total Revenue</span>
        </div>
        <div className="region-stat">
          <span className="region-stat__val">{regionSales.length}</span>
          <span className="region-stat__lbl">Regions</span>
        </div>
        <div className="region-stat">
          <span className="region-stat__val">
            {regionSales[0]?.region ?? "—"}
          </span>
          <span className="region-stat__lbl">Top Region</span>
        </div>
        <div className="region-stat">
          <span className="region-stat__val">
            ${regionSales.length ? Math.round(total / regionSales.length).toLocaleString() : "—"}
          </span>
          <span className="region-stat__lbl">Avg per Region</span>
        </div>
      </div>
    </div>
  );
}

export default RegionChart;
