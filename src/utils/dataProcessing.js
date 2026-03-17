

import Papa from "papaparse";

export const loadData = async () => {
  const response = await fetch("/superStoreDataSet.csv");
  const csv = await response.text();

  return new Promise((resolve) => {
    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true, //  remove empty rows
      complete: (result) => {
        const cleanedData = result.data
          .filter((row) => row && row.Sales && row.Category) //  remove invalid rows
          .map((row) => {
            const sales = parseFloat(row.Sales);

            return {
              ...row,
              //  clean numeric values
              Sales: isNaN(sales) ? 0 : sales,

              //  normalize category
              Category: row.Category?.trim().toLowerCase()
            };
          });

        resolve(cleanedData);
      }
    });
  });
};


export const calculateKPIs = (data) => {
  const totalRevenue = data.reduce(
    (sum, row) => sum + (row.Sales || 0), 
    0
  );

  const totalOrders = data.length;

  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0; // avoid divide by 0

  const topCategory = Object.values(
    data.reduce((acc, row) => {
      const category = row.Category || "unknown"; //  fallback

      acc[category] = acc[category] || { name: category, sales: 0 };
      acc[category].sales += row.Sales || 0;

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