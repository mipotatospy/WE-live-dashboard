import "./LiveStatusTabBar.css";

function LiveStatusTabBar({ activeTab, onTabChange }) {
  return (
    <div className="live-status-tab-bar">
        <button
            className={`live-status-tab-button ${
            activeTab === "attendance" ? "active" : ""
            }`}
            onClick={() => onTabChange("attendance")}
        >
            Attendance Status
        </button>

        <button
            className={`live-status-tab-button ${
            activeTab === "trend" ? "active" : ""
            }`}
            onClick={() => onTabChange("trend")}
        >
            Live Trend
        </button>
    </div>
  );
}

export default LiveStatusTabBar;