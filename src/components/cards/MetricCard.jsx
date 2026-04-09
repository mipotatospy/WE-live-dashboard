import "./MetricCard.css";

function MetricCard({ title, value, subtitle }) {
  return (
    <div className="metric-card">
      <div className="metric-card-title">{title}</div>
      <div className="metric-card-value">{value}</div>
      {subtitle ? <div className="metric-card-subtitle">{subtitle}</div> : null}
    </div>
  );
}

export default MetricCard;