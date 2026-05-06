import { useEffect, useMemo, useState, useCallback } from "react";
import { loadData, calculateKPIs } from "./utils/dataProcessing";
import { exportToCSV, exportToPDF } from "./utils/exportUtils";
import KPIcard from "./components/KPICard";
import DataTable from "./components/DataTable";
import CategoryChart from "./components/CategoryChart";
import RegionChart from "./components/RegionChart";
import SalesChart from "./components/SalesChart";
import Segmentation from "./components/Segmentation";
import Section from "./utils/Section";
import "./App.css";

const TABS = ["Overview", "Trends", "Segmentation", "Records"];

function App() {
  const [data, setData] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [fileName, setFileName] = useState("superStoreDataSet.csv");
  const [uploading, setUploading] = useState(false);
  const [filters, setFilters] = useState({
    year: "all",
    region: "all",
    category: "all",
  });

  /* ── Initial data load ── */
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const dataset = await loadData();
        if (!isMounted) return;
        setData(dataset);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  /* ── Dark mode class on <html> ── */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  /* ── Derive filter options from raw data ── */
  const years = useMemo(
    () => [...new Set(data.map((d) => d["Order Date"]?.slice(-4)).filter(Boolean))].sort(),
    [data]
  );
  const regions = useMemo(
    () => [...new Set(data.map((d) => d["Region"]).filter(Boolean))].sort(),
    [data]
  );
  const categories = useMemo(
    () => [...new Set(data.map((d) => d["Category"]).filter(Boolean))].sort(),
    [data]
  );

  /* ── Apply filters ── */
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (filters.year !== "all" && !row["Order Date"]?.includes(filters.year)) return false;
      if (filters.region !== "all" && row["Region"] !== filters.region) return false;
      if (filters.category !== "all" && row["Category"] !== filters.category) return false;
      return true;
    });
  }, [data, filters]);

  /* ── KPIs re-compute whenever filtered data changes ── */
  useEffect(() => {
    if (filteredData.length > 0) setKpis(calculateKPIs(filteredData));
  }, [filteredData]);

  /* ── Table search on top of filtered data ── */
  const tableData = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return filteredData;
    return filteredData.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(query))
    );
  }, [filteredData, searchTerm]);

  /* ── CSV upload ── */
  const handleCSVUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setFileName(file.name);
    import("papaparse").then(({ default: Papa }) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: ({ data: parsed }) => {
          setData(parsed);
          setFilters({ year: "all", region: "all", category: "all" });
          setSearchTerm("");
          setUploading(false);
        },
        error: () => setUploading(false),
      });
    });
  }, []);

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => setFilters({ year: "all", region: "all", category: "all" });

  return (
    <div className="app-container">

      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-left">
          <h1>Sales Analytics Dashboard</h1>
          <span className="filename-badge">{fileName}</span>
        </div>
        <div className="header-actions">
          <label className="action-btn upload-btn" title="Upload a CSV file">
            {uploading ? "Loading…" : "⬆ Upload CSV"}
            <input
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={handleCSVUpload}
            />
          </label>
          <button
            className="action-btn"
            onClick={() => exportToCSV(filteredData)}
            title="Export filtered data as CSV"
          >
            ⬇ Export CSV
          </button>
          <button
            className="action-btn"
            onClick={() => exportToPDF(kpis, filteredData)}
            title="Export summary as PDF"
          >
            ⬇ Export PDF
          </button>
          <button
            className="action-btn dark-toggle"
            onClick={() => setDarkMode((d) => !d)}
            title="Toggle dark mode"
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀ Light" : "☾ Dark"}
          </button>
        </div>
      </header>

      {/* ── Filter bar ── */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Year</label>
          <select value={filters.year} onChange={(e) => handleFilterChange("year", e.target.value)}>
            <option value="all">All Years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Region</label>
          <select value={filters.region} onChange={(e) => handleFilterChange("region", e.target.value)}>
            <option value="all">All Regions</option>
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Category</label>
          <select value={filters.category} onChange={(e) => handleFilterChange("category", e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button className="reset-btn" onClick={resetFilters}>✕ Reset</button>
        <span className="record-count">{filteredData.length.toLocaleString()} records</span>
      </div>

      {/* ── Tab navigation ── */}
      <nav className="tab-nav" aria-label="Dashboard sections">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-btn${activeTab === tab ? " active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* ── KPI cards (always visible) ── */}
      {kpis && (
        <div className="kpi-grid">
          <KPIcard title="Total Revenue"   value={kpis.totalRevenue}  icon="💰" trend="up"   trendValue="8.2%" />
          <KPIcard title="Total Orders"    value={kpis.totalOrders}   icon="📦" trend="up"   trendValue="3.1%" />
          <KPIcard title="Avg Order Value" value={kpis.avgOrderValue} icon="📈" trend="down" trendValue="1.4%" />
          <KPIcard title="Top Category"    value={kpis.topCategory}   icon="🏆" />
          <KPIcard title="Est. Profit"     value={kpis.totalProfit}   icon="💹" trend="up"   trendValue="5.3%" />
          <KPIcard title="Avg Margin"      value={kpis.avgMargin}     icon="📊" trend="up"   trendValue={kpis.avgMargin > 10 ? "Healthy" : "Low"} />
        </div>
      )}

      {/* ── Tab: Overview ── */}
      {activeTab === "Overview" && (
        <>
          <Section title="Sales by Region">
            <RegionChart data={filteredData} />
          </Section>
          <Section title="Sales by Category">
            <CategoryChart data={filteredData} />
          </Section>
        </>
      )}

      {/* ── Tab: Trends ── */}
      {activeTab === "Trends" && (
        <Section title="Monthly & Yearly Sales Trend">
          <SalesChart data={filteredData} />
        </Section>
      )}

      {/* ── Tab: Segmentation ── */}
      {activeTab === "Segmentation" && (
        <Section title="Customer Segmentation">
          <Segmentation data={filteredData} />
        </Section>
      )}

      {/* ── Tab: Records ── */}
      {activeTab === "Records" && (
        <Section title="Sales Records">
          <div className="table-toolbar">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID, region, category…"
              className="search-input"
              aria-label="Search sales records"
            />
            <span className="table-count">{tableData.length.toLocaleString()} results</span>
          </div>
          {data.length > 0 ? (
            <DataTable data={tableData} />
          ) : (
            <p className="loading-text">Loading data…</p>
          )}
        </Section>
      )}

    </div>
  );
}

export default App;
