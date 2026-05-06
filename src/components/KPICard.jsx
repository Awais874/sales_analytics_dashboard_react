import { useEffect, useRef, useState } from "react";

function useCountUp(target, duration = 800) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef(null);
  const prevRef = useRef(target);

  useEffect(() => {
    const from = prevRef.current;
    const to = target;
    if (from === to || typeof to !== "number") {
      setDisplay(to);
      prevRef.current = to;
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

function Sparkline({ positive }) {
  const points = positive
    ? [10, 14, 11, 16, 13, 18, 15, 20, 17, 22]
    : [22, 18, 20, 15, 17, 13, 16, 11, 14, 10];
  const min = Math.min(...points);
  const max = Math.max(...points);
  const norm = points.map((p) => ((p - min) / (max - min || 1)) * 28);
  const w = 60;
  const h = 32;
  const step = w / (points.length - 1);
  const coords = norm.map((y, i) => `${i * step},${h - y - 2}`);
  const polyline = coords.join(" ");
  const fill = `${coords.join(" ")} ${w},${h} 0,${h}`;
  const color = positive ? "#10b981" : "#ef4444";
  const fillColor = positive ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polygon points={fill} fill={fillColor} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function formatValue(value, title) {
  if (typeof value !== "number") return value ?? "—";
  const t = title?.toLowerCase() ?? "";
  if (t.includes("margin") || t.includes("rate")) return `${value.toFixed(1)}%`;
  if (t.includes("order") && !t.includes("value")) return Math.round(value).toLocaleString();
  return `$${Math.round(value).toLocaleString()}`;
}

function KPIcard({ title, value, icon, trend, trendValue }) {
  const isPositive = trend === "up";
  const hasTrend = !!trendValue;
  const animated = useCountUp(typeof value === "number" ? value : 0);
  const displayValue = typeof value === "number"
    ? formatValue(animated, title)
    : (value ?? "—");

  return (
    <div className="kpi-card">
      <div className="kpi-top-row">
        <div className="kpi-icon-wrap">
          <span className="kpi-icon" aria-hidden="true">{icon ?? "📊"}</span>
        </div>
        {hasTrend && (
          <span className={`kpi-badge ${isPositive ? "kpi-badge--up" : "kpi-badge--down"}`}>
            {isPositive ? "↑" : "↓"} {trendValue}
          </span>
        )}
      </div>

      <div className="kpi-value" aria-label={`${title}: ${displayValue}`}>
        {displayValue}
      </div>

      <div className="kpi-footer">
        <span className="kpi-label">{title}</span>
        {hasTrend && <Sparkline positive={isPositive} />}
      </div>
    </div>
  );
}

export default KPIcard;
