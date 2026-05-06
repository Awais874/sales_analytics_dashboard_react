import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMemo, useState } from "react";

const MARGIN_BY_CAT = {
  technology: 0.17,
  furniture: 0.04,
  "office supplies": 0.12,
};

const MONTH_ORDER = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="chart-tooltip__row" style={{ color: p.color }}>
          {p.name}: ${Math.round(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
}

function SalesChart({ data }) {
  const [view, setView] = useState("month");
  const [selectedYear, setSelectedYear] = useState("all");
  const [showProfit, setShowProfit] = useState(true);

  const years = useMemo(() => {
    const ys = [...new Set(data.map((r) => new Date(r["Order Date"]).getFullYear()).filter(Boolean))].sort();
    return ys;
  }, [data]);

  const chartData = useMemo(() => {
    const source = selectedYear === "all"
      ? data
      : data.filter((r) => new Date(r["Order Date"]).getFullYear() === +selectedYear);

    const grouped = source.reduce((acc, row) => {
      const date = new Date(row["Order Date"]);
      if (isNaN(date)) return acc;
      const sales = parseFloat(row["Sales"]) || 0;
      const cat = row["Category"]?.toLowerCase() ?? "office supplies";
      const profit = sales * (MARGIN_BY_CAT[cat] ?? 0.1);

      let key;
      if (view === "year") {
        key = String(date.getFullYear());
      } else {
        key = `${MONTH_ORDER[date.getMonth()]} ${date.getFullYear()}`;
      }

      if (!acc[key]) acc[key] = { period: key, sales: 0, profit: 0, _month: date.getMonth(), _year: date.getFullYear() };
      acc[key].sales += sales;
      acc[key].profit += profit;
      return acc;
    }, {});

    const sorted = Object.values(grouped).sort((a, b) => {
      if (view === "year") return +a.period - +b.period;
      if (a._year !== b._year) return a._year - b._year;
      return a._month - b._month;
    });

    return sorted.map((d) => ({
      period: d.period,
      sales: Math.round(d.sales),
      profit: Math.round(d.profit),
    }));
  }, [data, view, selectedYear]);

  const title = view === "month"
    ? `Monthly Sales Trend${selectedYear !== "all" ? ` — ${selectedYear}` : ""}`
    : "Yearly Sales Trend";

  return (
    <div className="sales-chart">
      <div className="sales-chart__header">
        <h2 className="sales-chart__title">{title}</h2>
        <div className="sales-chart__controls">
          {view === "month" && (
            <select
              className="chart-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              aria-label="Select year"
            >
              <option value="all">All Years</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          )}

          <div className="chart-toggle-group">
            <button
              className={`chart-toggle-btn${view === "month" ? " active" : ""}`}
              onClick={() => setView("month")}
            >
              Monthly
            </button>
            <button
              className={`chart-toggle-btn${view === "year" ? " active" : ""}`}
              onClick={() => setView("year")}
            >
              Yearly
            </button>
          </div>

          <label className="chart-checkbox-label">
            <input
              type="checkbox"
              checked={showProfit}
              onChange={(e) => setShowProfit(e.target.checked)}
            />
            Show profit
          </label>
        </div>
      </div>

      <div className="chart-legend">
        <span className="chart-legend__item">
          <span className="chart-legend__swatch" style={{ background: "#6366f1" }} />
          Sales
        </span>
        {showProfit && (
          <span className="chart-legend__item">
            <span className="chart-legend__swatch" style={{ background: "#10b981" }} />
            Est. Profit
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 60, bottom: 10 }}>
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 4" vertical={false} />

          <XAxis
            dataKey="period"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />

          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={55}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="sales"
            name="Sales"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#salesGrad)"
            dot={false}
            activeDot={{ r: 5, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
          />

          {showProfit && (
            <Area
              type="monotone"
              dataKey="profit"
              name="Est. Profit"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#profitGrad)"
              dot={false}
              activeDot={{ r: 5, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesChart;
