function KPIcard({ title, value, icon, trend, trendValue }) {
  const displayValue =
    typeof value === "number" ? `$${value.toLocaleString()}` : value;

  const isPositive = trend === "up";

  return (
    <div
      style={{
        padding: "24px",
        borderRadius: "16px",
        width: "100%", // ← only change — was "220px"
        backgroundColor: "#ffffff",
        color: "#1e293b",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
        border: "1px solid #f1f5f9",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Top row — icon + trend badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            width: "40px", height: "40px",
            borderRadius: "10px",
            backgroundColor: "#eff6ff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px",
          }}
        >
          {icon || "📊"}
        </div>

        {trendValue && (
          <span
            style={{
              fontSize: "12px",
              fontWeight: "600",
              padding: "3px 8px",
              borderRadius: "20px",
              backgroundColor: isPositive ? "#f0fdf4" : "#fef2f2",
              color: isPositive ? "#16a34a" : "#dc2626",
            }}
          >
            {isPositive ? "↑" : "↓"} {trendValue}
          </span>
        )}
      </div>

      {/* Value — hero number */}
      <div
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#0f172a",
          letterSpacing: "-0.02em",
          lineHeight: "1",
        }}
      >
        {displayValue}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: "13px",
          fontWeight: "500",
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {title}
      </div>
    </div>
  );
}

export default KPIcard;