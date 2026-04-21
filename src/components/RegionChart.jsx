import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"];

const CustomTooltip = ({ active, payload }) => {
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
        <p style={{ margin: "0 0 4px", color: "#94a3b8", fontSize: "12px" }}>
          {payload[0].name}
        </p>
        <p style={{ margin: 0, fontWeight: "700", color: "#a5b4fc" }}>
          ${payload[0].value.toLocaleString()}
        </p>
        {/* ← removed percent line — it was NaN because Recharts
            doesn't pass percent to custom tooltips on PieChart */}
      </div>
    );
  }
  return null;
};

function RegionChart({ data }) {
  const regionSales = Object.values(
    data.reduce((acc, row) => {
      const region = row["Region"]?.trim();
      const sales = parseFloat(row["Sales"]) || 0;
      if (!region) return acc;
      if (!acc[region]) acc[region] = { region, sales: 0 };
      acc[region].sales += sales;
      return acc;
    }, {})
  );

  return (
    <ResponsiveContainer width="100%" height={360}>
      <PieChart>
        <Pie
          data={regionSales}
          dataKey="sales"
          nameKey="region"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={60}
          paddingAngle={3}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(1)}%`
          }
          labelLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
          isAnimationActive={true}
        >
          {regionSales.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="none"
            />
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip />} />

        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: "#64748b", fontSize: "13px" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default RegionChart;