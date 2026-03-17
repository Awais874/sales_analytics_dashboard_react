import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// Professional color palette for a clean, official look
const COLORS = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"];

function CategoryChart({ data }) {
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
    <ResponsiveContainer width="100%" height={400}> {/* increased height */}
      <BarChart
        data={categorySales}
        margin={{ top: 30, right: 20, bottom: 30, left: 80 }} // left margin for Y labels
      >
        <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
        <XAxis
          dataKey="category"
          tick={{ fontWeight: "bold", fill: "#555" }}
          interval={0} // show all category labels
          angle={-10} // tilt labels slightly if too long
          textAnchor="end"
        />
        <YAxis
          tickFormatter={(val) => `$${val.toLocaleString()}`}
          tick={{ fontWeight: "bold", fill: "#555", fontSize: 12 }}
        />
        <Tooltip
          formatter={(value) => `$${value.toLocaleString()}`}
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />
       
        <Bar dataKey="sales" name="Sales">
          {categorySales.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              cursor="pointer"
            />
          ))}
          <LabelList
            dataKey="sales"
            position="top"
            formatter={(val) => `$${val.toLocaleString()}`}
            style={{ fontWeight: "bold", fill: "#333" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CategoryChart;