import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";


const COLORS = ["#4CAF50", "#8bb18d", "#4DD0E1", "#FFB74D", "#BA68C8", "#64B5F6"];

function RegionChart({ data }) {
const regionSales = Object.values(
  data.reduce((acc, row) => {
    const region = row["Region"]?.trim();
    const sales = parseFloat(row["Sales"]) || 0;

    //  Skip invalid regions
    if (!region) return acc;

    if (!acc[region]) acc[region] = { region, sales: 0 };
    acc[region].sales += sales;

    return acc;
  }, {})
);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={regionSales}
          dataKey="sales"
          nameKey="region"
          cx="50%"
          cy="50%"
          outerRadius={130}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(1)}%`
          }
          isAnimationActive={true}
        >
          {regionSales.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `$${value.toLocaleString()}`}
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          formatter={(value) => <span style={{ color: "#333" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default RegionChart;