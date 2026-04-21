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
import { useState, useEffect } from "react";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#0f172a",
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

function CategoryChart({ data }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  // ✅ Proper mobile detection — updates on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const categorySales = Object.values(
    data.reduce((acc, row) => {
      const category = row["Category"];
      const sales = parseFloat(row["Sales"]) || 0;
      if (!acc[category]) acc[category] = { category, sales: 0 };
      acc[category].sales += sales;
      return acc;
    }, {})
  );

  return (
    <>
      

      <ResponsiveContainer width="100%" height={isMobile ? 280 : 340}>
        <BarChart
          data={categorySales}
          margin={{
            top: 30,
            right: 10,
            bottom: isMobile ? 60 : 20,
            left: isMobile ? 20 : 60,
          }}
          barCategoryGap={isMobile ? "30%" : "25%"}
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
            width={isMobile ? 50 : 80}
            tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            tick={{ fontSize: isMobile ? 10 : 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />

          <Bar dataKey="sales" name="Sales" radius={[8, 8, 0, 0]}>
            {categorySales.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList
              dataKey="sales"
              position="top"
              formatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              style={{
                fontSize: isMobile ? 10 : 12,
                fill: "#64748b",
                fontWeight: "600",
              }}
            />
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

export default CategoryChart;