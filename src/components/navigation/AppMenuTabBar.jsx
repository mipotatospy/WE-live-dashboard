import "./AppMenuTabBar.css";
import { MdOutlineWifiTethering } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { IoStatsChart } from "react-icons/io5";

function AppMenuTabBar({ activeTab, onTabChange }) {
  return (
    <nav className="app-menu-tab-bar">
      <button
        className={`tab-button ${activeTab === "attendance" ? "active" : ""}`}
        onClick={() => onTabChange("attendance")}
      >
        <MdOutlineWifiTethering className="tab-icon" />
        <span className="tab-label">Live</span>
      </button>

      <button
        className={`tab-button ${activeTab === "comparison" ? "active" : ""}`}
        onClick={() => onTabChange("comparison")}
      >
        <IoStatsChart className="tab-icon" />
        <span className="tab-label">Comparison</span>
      </button>

      <button
        className={`tab-button ${activeTab === "lookup" ? "active" : ""}`}
        onClick={() => onTabChange("lookup")}
      >
        <FiSearch className="tab-icon" />
        <span className="tab-label">Lookup</span>
      </button>
    </nav>
  );
}

export default AppMenuTabBar;