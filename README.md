
# Sales Analytics Dashboard

A **React-based data analytics dashboard** for visualizing and analyzing sales data. This project demonstrates **data ingestion, cleaning, KPI computation, and interactive visualization** using a real-world dataset.


## DEMO
An Interactive analytics tool with year/region/category filters, offering a multi-tab view (Overview, Trends, Segmentation, Records) across all records with key KPIs including
<img width="1371" height="757" alt="image" src="https://github.com/user-attachments/assets/23e3a1c3-a800-4abc-98ef-c7f46d180db4" />


Customer Segmentation  displaying KPIs and spend-vs-orders scatter analysis across 793 customers grouped into High Value, Mid Value, Low Value, and At Risk tiers — totaling $2.26M in revenue and $254k estimated profit.
<img width="1392" height="902" alt="image" src="https://github.com/user-attachments/assets/e0ef7071-c56e-4292-8dc6-892c04a0e7c2" />


Time based Trends, Monthly, yearly
<img width="1390" height="647" alt="image" src="https://github.com/user-attachments/assets/a0e5a498-c076-4882-9395-2ca13685bf7c" />


## Technologies

* **Frontend Framework**: React 19
* **Charting & Visualization**: Recharts
* **Data Parsing**: PapaParse
* **Build Tool**: Vite
* **Code Quality**: ESLint, Babel
* **Deployment**: Vercel


## Dataset

* **Source**: Open dataset *(Kaggle Sales Data)*
* **Rows**: 9000+
* **Columns**: `OrderID`, `Date`, `Product`, `Category`, `Region`, `Sales`

The dataset is loaded and parsed directly in the frontend using **PapaParse**, enabling fast and flexible client-side data processing.


## Data Processing & Cleaning

Before calculating KPIs, the dataset undergoes lightweight **data cleaning and normalization** to ensure accuracy and consistency:

* **Empty row removal** – Skips blank or malformed CSV rows
* **Missing value handling** – Filters out rows with missing critical fields (e.g., `Sales`, `Category`)
* **Numeric conversion** – Safely converts `Sales` values to numbers (`parseFloat`)
* **Invalid value handling** – Replaces `NaN` or corrupt values with `0`
* **Text normalization** – Trims whitespace and standardizes categories (e.g., lowercase)
* **Fallback handling** – Assigns default values like `"unknown"` for missing categories

This ensures that all KPIs are computed on **clean, reliable data**, reducing the risk of incorrect insights.


## Key Metrics (KPIs)

The dashboard dynamically calculates and displays:

1. **Total Revenue** – Sum of all sales
2. **Average Order Value (AOV)** – Revenue per order
3. **Top Performing Category** – Based on total sales
4. **Monthly Growth Rate** – Revenue trends over time
5. **Regional Sales Distribution** – Sales comparison across regions

---

## Features

* Real-time KPI calculations from raw CSV data
* Interactive and responsive charts
* Clean, minimal, and user-friendly UI
* Client-side data processing (no backend required)
* Scalable structure for adding more analytics





## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/Awais874/sales_analytics_dashboard_react.git
cd sales-Analytics-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

### 4. Open in browser

```
http://localhost:5173
```

### 5. Build for production

```bash
npm run build
```

### 6. Preview production build

```bash
npm run preview
```


## Deployment

The application is deployed on **Vercel**
🔗 [https://salesanalyticsdashboardreact.vercel.app/](https://salesanalyticsdashboardreact.vercel.app/)

---

## Future Improvements

* Advanced data cleaning (duplicate detection, date validation)
* Filtering and drill-down analytics
* Backend integration for large-scale datasets
* User-defined KPI customization

