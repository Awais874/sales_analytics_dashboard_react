

function KPIcard({ title, value }) {
 const displayValue =
    typeof value === "number" ? `$${value.toLocaleString()}` : value;

  return (
    <div
      style={{
        border: "5px solid #c3b9b9",
        padding: "20px",
        borderRadius: "10px",
        width: "200px",
        backgroundColor: "#4caf50", // green for positive KPI
        color: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // subtle shadow
        textAlign: "center",
      }}
    >
      <h3 style={{ marginBottom: "20px",fontSize: "1.3rem"  }}>{title}</h3>
      <h2 style={{ color: "white", }}>
        {displayValue}
      </h2>
    </div>
  );
}

export default KPIcard;