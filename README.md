

# Sales Analytics Dashboard

A **React-based data analytics dashboard** for visualizing sales data. This project demonstrates data processing, KPI calculation, and interactive charting using a large dataset.


## Dataset

* **Source**: Open dataset [ Kaggle Sales Data ]
* **Rows**: 9000+
* **Columns**: Examples include `OrderID`, `Date`, `Product`, `Category`, `Region`, `sales`

The dataset is parsed and processed in the frontend using **PapaParse**.


## Key Metrics (KPIs)

The dashboard calculates and displays the following KPIs:

1. **Total Revenue** – Sum of all sales revenue
2. **Average Order Value (AOV)** – Average revenue per order
3. **Top Performing Product/Category** – Based on total revenue
4. **Monthly Growth Rate** – Revenue growth over time
5. **Regional Sales Distribution** – Revenue comparison by region



## Features

* Dynamic KPI calculations from raw dataset
* Interactive, responsive charts and tables
* Clean and minimal UI for usability

---

## Technologies

* **Frontend Framework**: React 19
* **Charting & Visualization**: Recharts, 
* **Data Parsing**: PapaParse
* **Build Tool**: Vite
* **Linting & Code Quality**: ESLint, Babel
* **Deployment**: Vercel 

---

## Running Locally

1. Clone the repository:

```bash
git clone (https://github.com/Awais874/Sales-Analytics-Dashboard.git)
cd sales-Analytics-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Open the app in your browser at `http://localhost:5173` (default Vite port)

5. Build for production:

```bash
npm run build
```

6. Preview production build:

```bash
npm run preview
```

---

## Deployment

The dashboard can be deployed on **Vercel** or **Netlify** as a static React app. Once deployed, it can be accessed via a public URL for testing and demonstration.
