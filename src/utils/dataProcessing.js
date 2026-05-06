import Papa from "papaparse";

const MARGIN_BY_CAT = {
  technology:        0.17,
  furniture:         0.04,
  "office supplies": 0.12,
};

/* ── Load & clean ──────────────────────────────────────────────────── */
export const loadData = async () => {
  const response = await fetch("/superStoreDataSet.csv");
  const csv      = await response.text();

  return new Promise((resolve) => {
    Papa.parse(csv, {
      header:         true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const cleaned = data
          .filter((row) => row?.Sales && row?.Category)
          .map((row) => {
            const sales = parseFloat(row.Sales);
            return {
              ...row,
              Sales:    isNaN(sales) ? 0 : sales,
              // preserve original casing — charts depend on "Technology" etc.
              Category: row.Category?.trim(),
              Region:   row.Region?.trim(),
            };
          });
        resolve(cleaned);
      },
    });
  });
};

/* ── KPI calculation ───────────────────────────────────────────────── */
export const calculateKPIs = (data) => {
  if (!data?.length) return null;

  const totalRevenue = data.reduce((sum, row) => sum + (row.Sales || 0), 0);
  const totalOrders  = new Set(data.map((r) => r["Order ID"]).filter(Boolean)).size || data.length;
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  // profit
  const totalProfit = data.reduce((sum, row) => {
    const cat    = row.Category?.toLowerCase() ?? "";
    const margin = MARGIN_BY_CAT[cat] ?? 0.1;
    return sum + (row.Sales || 0) * margin;
  }, 0);
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // top category
  const catMap = data.reduce((acc, row) => {
    const cat = row.Category || "Unknown";
    acc[cat]  = (acc[cat] || 0) + (row.Sales || 0);
    return acc;
  }, {});
  const topCatEntry  = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
  const topCategory  = topCatEntry?.[0] ?? "—";
  const topCategoryVal = topCatEntry?.[1] ?? 0;

  // top region
  const regMap = data.reduce((acc, row) => {
    const reg = row.Region || "Unknown";
    acc[reg]  = (acc[reg] || 0) + (row.Sales || 0);
    return acc;
  }, {});
  const topRegEntry = Object.entries(regMap).sort((a, b) => b[1] - a[1])[0];
  const topRegion   = topRegEntry?.[0] ?? "—";
  const topRegionVal  = topRegEntry?.[1] ?? 0;

  // yearly growth
  const yearMap = data.reduce((acc, row) => {
    const year = row["Order Date"]?.slice(-4);
    if (!year || isNaN(+year)) return acc;
    acc[year] = (acc[year] || 0) + (row.Sales || 0);
    return acc;
  }, {});
  const yearlyGrowth = Object.entries(yearMap)
    .sort((a, b) => +a[0] - +b[0])
    .map(([year, val]) => ({ year, val: Math.round(val) }));

  return {
    totalRevenue:   Math.round(totalRevenue),
    totalOrders,
    avgOrderValue:  Math.round(avgOrderValue),
    totalProfit:    Math.round(totalProfit),
    avgMargin:      +avgMargin.toFixed(1),
    topCategory,
    topCategoryVal: Math.round(topCategoryVal),
    topRegion,
    topRegionVal:   Math.round(topRegionVal),
    yearlyGrowth,
  };
};