
import { useEffect, useState } from "react";
import { loadData, calculateKPIs } from "./utils/dataProcessing";
import KPIcard from "./components/KPICard";
import DataTable from "./components/DataTable";
import CategoryChart from "./components/CategoryChart";
import RegionChart from "./components/RegionChart";
import SalesChart from "./components/SalesChart";
import Section from "./utils/Section";
import "./App.css"; 

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