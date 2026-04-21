import { useEffect, useMemo, useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const dataset = await loadData();
        if (!isMounted) return;
        setData(dataset);
        setKpis(calculateKPIs(dataset));
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  const filteredData = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return data;
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
  }, [data, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sales Analytics Dashboard</h1>
        <p>
          Overview of your sales performance, including monthly and yearly trends,
          top categories, regional performance, and key business metrics.
        </p>
      </header>

      {kpis && (
        <div className="kpi-grid">
          <KPIcard title="Total Revenue"   value={kpis.totalRevenue}  icon="💰" trend="up"   trendValue="8.2%" />
          <KPIcard title="Total Orders"    value={kpis.totalOrders}   icon="📦" trend="up"   trendValue="3.1%" />
          <KPIcard title="Avg Order Value" value={kpis.avgOrderValue} icon="📈" trend="down" trendValue="1.4%" />
          <KPIcard title="Top Category"    value={kpis.topCategory}   icon="🏆" />
        </div>
      )}

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
        <div className="table-toolbar">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search table data..."
            className="search-input"
            aria-label="Search sales records"
          />
        </div>

        {data.length > 0 ? (
          <DataTable data={filteredData} />
        ) : (
          <p className="loading-text">Loading data...</p>
        )}
      </Section>
    </div>
  );
}

export default App;