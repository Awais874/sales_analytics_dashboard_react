import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useState, useEffect, useMemo } from "react";

const COLORS = {
  Technology:       "#6366f1",
  Furniture:        "#f59e0b",
  "Office Supplies": "#10b981",
};

const MARGIN_BY_CAT = {
  technology:        0.17,
  furniture:         0.04,
  "office supplies": 0.12,
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="chart-tooltip__row" style={{ color: p.fill }}>
          {p.name}: ${Math.round(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
}

function CategoryChart({ data }) {
  const [isMobile, setIsMobile]     = useState(window.innerWidth < 600);
  const [showProfit, setShowProfit]  = useState(true);
  const [sortBy, setSortBy]         = useState("sales");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const categorySales = useMemo(() => {
    const grouped = data.reduce((acc, row) => {
      const category = row["Category"];
      if (!category) return acc;
      const sales  = parseFloat(row["Sales"]) || 0;
      const cat    = category.toLowerCase();
      const profit = sales * (MARGIN_BY_CAT[cat] ?? 0.1);
      if (!acc[category]) acc[category] = { category, sales: 0, profit: 0 };
      acc[category].sales  += sales;
      acc[category].profit += profit;
      return acc;
    }, {});

    return Object.values(grouped)
      .map((d) => ({
        ...d,
        sales:  Math.round(d.sales),
        profit: Math.round(d.profit),
      }))
      .sort((a, b) => b[sortBy] - a[sortBy]);
  }, [data, sortBy]);

  const margin = { top: 30, right: 16, bottom: isMobile ? 60 : 20, left: isMobile ? 20 : 70 };

  return (
    <div className="category-chart">
      <div className="category-chart__header">
        <div className="chart-legend">
          <span className="chart-legend__item">
            <span className="chart-legend__swatch" style={{ background: "#6366f1" }} />
            Technology
          </span>
          <span className="chart-legend__item">
            <span className="chart-legend__swatch" style={{ background: "#f59e0b" }} />
            Furniture
          </span>
          <span className="chart-legend__item">
            <span className="chart-legend__swatch" style={{ background: "#10b981" }} />
            Office Supplies
          </span>
        </div>

        <div className="category-chart__controls">
          <label className="chart-checkbox-label">
            <input
              type="checkbox"
              checked={showProfit}
              onChange={(e) => setShowProfit(e.target.checked)}
            />
            Show profit
          </label>

          <select
            className="chart-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort bars by"
          >
            <option value="sales">Sort by Sales</option>
            <option value="profit">Sort by Profit</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={isMobile ? 280 : 340}>
        <BarChart
          data={categorySales}
          margin={margin}
          barCategoryGap={showProfit ? "20%" : "35%"}
          barGap={4}
        >
          <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 4" vertical={false} />

          <XAxis
            dataKey="category"
            interval={0}
            angle={isMobile ? -30 : 0}
            textAnchor={isMobile ? "end" : "middle"}
            height={isMobile ? 60 : 40}
            tick={{ fontSize: isMobile ? 10 : 13, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            width={isMobile ? 50 : 70}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: isMobile ? 10 : 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />

          <Bar dataKey="sales" name="Sales" radius={[6, 6, 0, 0]}>
            {categorySales.map((entry) => (
              <Cell key={entry.category} fill={COLORS[entry.category] ?? "#6366f1"} />
            ))}
            <LabelList
              dataKey="sales"
              position="top"
              formatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              className="bar-label"
              style={{ fontSize: isMobile ? 10 : 12, fill: "#64748b", fontWeight: "600" }}
            />
          </Bar>

          {showProfit && (
            <Bar dataKey="profit" name="Est. Profit" radius={[6, 6, 0, 0]} opacity={0.75}>
              {categorySales.map((entry) => (
                <Cell key={`p-${entry.category}`} fill={COLORS[entry.category] ?? "#6366f1"} />
              ))}
              <LabelList
                dataKey="profit"
                position="top"
                formatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                style={{ fontSize: isMobile ? 9 : 11, fill: "#94a3b8", fontWeight: "600" }}
              />
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart;
