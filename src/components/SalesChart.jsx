import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";
import { useMemo, useState } from "react";

function SalesChart({ data }) {
  const [view, setView] = useState("month");

  const salesData = useMemo(() => {
    const grouped = data.reduce((acc, row) => {
      const date = new Date(row["Order Date"]);
      const sales = parseFloat(row["Sales"]) || 0;

      let key;
      if (view === "year") {
        key = date.getFullYear();
      } else {
        const month = date.toLocaleString("default", { month: "short" });
        key = `${month} ${date.getFullYear()}`;
      }

      if (!acc[key]) acc[key] = { period: String(key), sales: 0 };
      acc[key].sales += sales;
      return acc;
    }, {});

    return Object.values(grouped);
  }, [data, view]);

  const btnStyle = (active) => ({
    padding: "7px 20px",
    borderRadius: "20px",
    border: "1px solid",
    borderColor: active ? "#6366f1" : "#e2e8f0",
    backgroundColor: active ? "#6366f1" : "#ffffff",
    color: active ? "#ffffff" : "#64748b",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    letterSpacing: "0.02em",
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "#0f172a",
          border: "none",
          borderRadius: "10px",
          padding: "10px 16px",
          color: "#f8fafc",
          fontSize: "13px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}>
          <p style={{ margin: "0 0 4px", color: "#94a3b8", fontSize: "12px" }}>{label}</p>
          <p style={{ margin: 0, fontWeight: "700", color: "#a5b4fc" }}>
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Header row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <h2 style={{
          margin: 0,
          fontSize: "16px",
          fontWeight: "600",
          color: "#0f172a",
          letterSpacing: "-0.01em",
        }}>
          {view === "month" ? "Monthly Sales Trend" : "Yearly Sales Trend"}
        </h2>

        {/* Toggle buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setView("month")} style={btnStyle(view === "month")}>Monthly</button>
          <button onClick={() => setView("year")}  style={btnStyle(view === "year")}>Yearly</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={salesData} margin={{ top: 10, right: 20, left: 60, bottom: 10 }}>

          <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 4" vertical={false} />

          <XAxis
            dataKey="period"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ fontSize: "13px", color: "#64748b", paddingTop: "12px" }}
          />

          <Line
            type="monotone"
            dataKey="sales"
            name="Sales"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
          />

        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default SalesChart;