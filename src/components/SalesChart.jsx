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
        const month = date.toLocaleString("default", { month: "long" });
        key = `${month} ${date.getFullYear()}`;
      }

      if (!acc[key]) acc[key] = { period: key, sales: 0 };

      acc[key].sales += sales;

      return acc;

    }, {});

    return Object.values(grouped);

  }, [data, view]);

  return (
<>

<h2 style={{ textAlign: "center", marginBottom: "15px", fontWeight: "600" }}>
  {view === "month" ? "Monthly Sales Trend" : "Yearly Sales Trend"}
</h2>




    <div>

      <div style={{ 
        
  display: "flex", 
   justifyContent: "center",
  gap: "8px", 
  marginBottom: "15px" 
}}>

  <button
    onClick={() => setView("month")}
    style={{
      padding: "8px 16px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      backgroundColor: view === "month" ? "#4CAF50" : "#f5f5f5",
      color: view === "month" ? "#fff" : "#333",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.2s ease"
    }}
  >
    Monthly
  </button>

  <button
    onClick={() => setView("year")}
    style={{
      padding: "8px 16px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      backgroundColor: view === "year" ? "#4CAF50" : "#f5f5f5",
      color: view === "year" ? "#fff" : "#333",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.2s ease"
    }}
  >
    Yearly
  </button>

</div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={salesData} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
          
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />

          <XAxis
            dataKey="period"
            tick={{ fill: "#555", fontSize: 12 }}
          />

          <YAxis
            tickFormatter={(val) => `$${val.toLocaleString()}`}
          />

          <Tooltip
            formatter={(value) => `$${value.toLocaleString()}`}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="sales"
            name="Sales"
            stroke="#4CAF50"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
    </>
  );
}

export default SalesChart;