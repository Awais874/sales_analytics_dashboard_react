import Papa from "papaparse";

export const loadData = async () => {
  const response = await fetch("/superStoreDataSet.csv");
  const csv = await response.text();

  return new Promise((resolve) => {
    Papa.parse(csv, {
      header: true,
      complete: (result) => {
        resolve(result.data);
      }
    });
  });
};


export const calculateKPIs = (data) => {
  const totalRevenue = data.reduce(
    (sum, row) => sum + parseFloat(row.Sales || 0),
    0
  );

  const totalOrders = data.length;

  const avgOrderValue = totalRevenue / totalOrders;

  const topCategory = Object.values(
    data.reduce((acc, row) => {
      acc[row.Category] = acc[row.Category] || { name: row.Category, sales: 0 };
      acc[row.Category].sales += parseFloat(row.Sales || 0);
      return acc;
    }, {})
  ).sort((a, b) => b.sales - a.sales)[0];

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    topCategory: topCategory?.name
  };
};




