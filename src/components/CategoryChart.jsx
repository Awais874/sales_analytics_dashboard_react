// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   Cell,
//   Legend,
//   ResponsiveContainer,
//   LabelList,
// } from "recharts";

// const COLORS = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"];

// function CategoryChart({ data }) {
//   const categorySales = Object.values(
//     data.reduce((acc, row) => {
//       const category = row["Category"];
//       const sales = parseFloat(row["Sales"]) || 0;
//       if (!acc[category]) acc[category] = { category, sales: 0 };
//       acc[category].sales += sales;
//       return acc;
//     }, {})
//   );

//   return (
//     <ResponsiveContainer width="100%" height={400}> 
//       <BarChart
//         data={categorySales}
//         margin={{ top: 30, right: 20, bottom: 30, left: 80 }} 
//       >
//         <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
//         <XAxis
//           dataKey="category"
//           tick={{ fontWeight: "bold", fill: "#555" }}
//           interval={0} 
//           angle={-10} 
//           textAnchor="end"
//         />
//         <YAxis
//           tickFormatter={(val) => `$${val.toLocaleString()}`}
//           tick={{ fontWeight: "bold", fill: "#555", fontSize: 12 }}
//         />
//         <Tooltip
//           formatter={(value) => `$${value.toLocaleString()}`}
//           contentStyle={{
//             backgroundColor: "#fff",
//             borderRadius: "8px",
//             border: "none",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//           }}
//         />
       
//         <Bar dataKey="sales" name="Sales">
//           {categorySales.map((entry, index) => (
//             <Cell
//               key={`cell-${index}`}
//               fill={COLORS[index % COLORS.length]}
//               cursor="pointer"
//             />
//           ))}
//           <LabelList
//             dataKey="sales"
//             position="top"
//             formatter={(val) => `$${val.toLocaleString()}`}
//             style={{ fontWeight: "bold", fill: "#333" }}
//           />
//         </Bar>
//       </BarChart>
//     </ResponsiveContainer>
//   );
// }

// export default CategoryChart;





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

const COLORS = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"];

// ✅ Detect mobile
const isMobile = window.innerWidth < 600;

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
    <ResponsiveContainer width="100%" height={isMobile ? 280 : 400}>
      <BarChart
        data={categorySales}
        margin={{
          top: 20,
          right: 10,
          bottom: isMobile ? 60 : 30,
          left: isMobile ? 20 : 60,
        }}
        barCategoryGap={isMobile ? "30%" : "20%"}
      >
        <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />

        {/* ✅ X AXIS FIX */}
        <XAxis
          dataKey="category"
          interval={0}
          angle={isMobile ? -30 : -10}
          textAnchor="end"
          height={isMobile ? 60 : 40}
          tick={{
            fontSize: isMobile ? 10 : 12,
            fill: "#555",
            fontWeight: "bold",
          }}
        />

        {/* ✅ Y AXIS FIX */}
        <YAxis
          width={isMobile ? 50 : 80}
          tickFormatter={(val) => `$${val.toLocaleString()}`}
          tick={{
            fontSize: isMobile ? 10 : 12,
            fill: "#555",
          }}
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

        <Bar dataKey="sales" name="Sales" radius={[6, 6, 0, 0]}>
          {categorySales.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}

          {/* ✅ LABEL FIX (BIGGEST CHANGE) */}
          <LabelList
            dataKey="sales"
            position={isMobile ? "insideTop" : "top"}
            formatter={(val) =>
              isMobile
                ? `$${(val / 1000).toFixed(0)}k` // shorter for mobile
                : `$${val.toLocaleString()}`
            }
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: isMobile ? "#fff" : "#333",
              fontWeight: "bold",
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CategoryChart;