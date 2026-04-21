function DataTable({ data }) {
  const headers = ["Order ID", "Order Date", "Region", "Category", "Sub-Category", "Sales"];

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        minWidth: "600px",
        fontSize: "13px",
      }}>

        {/* Header */}
        <thead>
          <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
            {headers.map((h) => (
              <th key={h} style={{
                padding: "14px 16px",
                textAlign: h === "Sales" ? "right" : "left",
                color: "#94a3b8",
                fontWeight: "600",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                background: "#ffffff",
                whiteSpace: "nowrap",
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {data.slice(0, 20).map((row, index) => (
            <tr
              key={index}
              style={{
                borderBottom: "1px solid #f8fafc",
                background: "#ffffff",
                transition: "background 0.15s",
                cursor: "default",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f8faff"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#ffffff"}
            >
              <td style={{ padding: "13px 16px", color: "#6366f1", fontWeight: "600", fontFamily: "monospace", fontSize: "12px" }}>
                {row["Order ID"]}
              </td>
              <td style={{ padding: "13px 16px", color: "#64748b" }}>
                {row["Order Date"]}
              </td>
              <td style={{ padding: "13px 16px" }}>
                <span style={{
                  padding: "3px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "600",
                  background: "#eff6ff",
                  color: "#6366f1",
                }}>
                  {row["Region"]}
                </span>
              </td>
              <td style={{ padding: "13px 16px", color: "#0f172a", fontWeight: "500" }}>
                {row["Category"]}
              </td>
              <td style={{ padding: "13px 16px", color: "#64748b" }}>
                {row["Sub-Category"]}
              </td>
              <td style={{ padding: "13px 16px", textAlign: "right", fontWeight: "700", color: "#0f172a", fontFamily: "monospace" }}>
                ${parseFloat(row["Sales"]).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;