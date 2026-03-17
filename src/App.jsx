

// import { useEffect, useState } from "react";
// import { loadData, calculateKPIs } from "./utils/dataProcessing";
// import KPIcard from "./components/KPICard";
// import DataTable from "./components/DataTable";
// import CategoryChart from "./components/CategoryChart";
// import RegionChart from "./components/RegionChart";
// import SalesChart from "./components/SalesChart";
// import Section from "./utils/Section";

// function App() {
//   const [data, setData] = useState([]);
//   const [kpis, setKpis] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const dataset = await loadData();
//       setData(dataset);

//       const metrics = calculateKPIs(dataset);
//       setKpis(metrics);

//       console.log(dataset);
//     };

//     fetchData();
//   }, []);

//   return (
//     <div
//       style={{
//         background: "#f0f2f5",
//         minHeight: "100vh",
//         padding: "0px 60px",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//         color: "#333",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//       }}
//     >
     
//       <header
//         style={{
//           width: "100%",
//           background: "linear-gradient(135deg, #4CAF50, #72ce77)",
//           padding: "64px",
//           borderRadius: "8px",
//           boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
//           textAlign: "center",
//           marginBottom: "30px",
//           color: "white",
//         }}
//       >
//         <h1 style={{ fontSize: "3rem", fontWeight: 700, marginBottom: "20px", color: "white" }}>
//           Sales Analytics Dashboard
//         </h1>
//         <p style={{ fontSize: "1rem", fontWeight: 400, maxWidth: "800px", margin: "0 auto" }}>
//           Overview of your sales performance, including monthly and yearly trends, top categories, regional performance, and key business metrics.
//         </p>
//       </header>

//       {/* KPI Cards */}
//       {kpis && (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//             gap: "30px",
//             marginBottom: "60px",
//             justifyContent: "center",
//             width: "100%",
//             maxWidth: "1200px",
//           }}
//         >
//           <KPIcard title="Total Revenue" value={kpis.totalRevenue} />
//           <KPIcard title="Total Orders" value={kpis.totalOrders} />
//           <KPIcard title="Avg Order Value" value={kpis.avgOrderValue} />
//           <KPIcard title="Top Category" value={kpis.topCategory} />
//         </div>
//       )}

//       {/* Sections */}
//       <Section title="Sales by Region">
//         <RegionChart data={data} />
//       </Section>

//       <Section title="Categories Chart">
//         <CategoryChart data={data} />
//       </Section>

//       <Section>
//         <SalesChart data={data} />
//       </Section>

//       <Section title="Sales Records">
//         {data.length > 0 ? (
//           <DataTable data={data} />
//         ) : (
//           <p style={{ color: "#666", textAlign: "center" }}>Loading data...</p>
//         )}
//       </Section>
//     </div>
//   );
// }

// export default App;

import { useEffect, useState } from "react";
import { loadData, calculateKPIs } from "./utils/dataProcessing";
import KPIcard from "./components/KPICard";
import DataTable from "./components/DataTable";
import CategoryChart from "./components/CategoryChart";
import RegionChart from "./components/RegionChart";
import SalesChart from "./components/SalesChart";
import Section from "./utils/Section";
import "./App.css"; // Make sure to import the CSS file

function App() {
  const [data, setData] = useState([]);
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const dataset = await loadData();
      setData(dataset);

      const metrics = calculateKPIs(dataset);
      setKpis(metrics);

      console.log(dataset);
    };

    fetchData();
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>Sales Analytics Dashboard</h1>
        <p>
          Overview of your sales performance, including monthly and yearly trends,
          top categories, regional performance, and key business metrics.
        </p>
      </header>

      {/* KPI Cards */}
      {kpis && (
        <div className="kpi-grid">
          <KPIcard title="Total Revenue" value={kpis.totalRevenue} />
          <KPIcard title="Total Orders" value={kpis.totalOrders} />
          <KPIcard title="Avg Order Value" value={kpis.avgOrderValue} />
          <KPIcard title="Top Category" value={kpis.topCategory} />
        </div>
      )}

      {/* Sections */}
      <Section title="Sales by Region">
        <RegionChart data={data} />
      </Section>

      <Section title="Categories Chart">
        <CategoryChart data={data} />
      </Section>

      <Section>
        <SalesChart data={data} />
      </Section>

      <Section title="Sales Records">
        {data.length > 0 ? (
          <DataTable data={data} />
        ) : (
          <p className="loading-text">Loading data...</p>
        )}
      </Section>
    </div>
  );
}

export default App;