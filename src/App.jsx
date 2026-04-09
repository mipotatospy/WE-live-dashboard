import { useState } from "react";
import AttendanceStatusPage from "./pages/LiveStatus/LiveStatusSection.jsx";
import ComparisonPage from "./pages/Comparison/ComparisonPage.jsx";
import LookupPage from "./pages/Lookup/LookupPage.jsx";
import AppMenuTabBar from "./components/navigation/AppMenuTabBar.jsx";
import "./App.css";
import LiveStatusSection from "./pages/LiveStatus/LiveStatusSection.jsx";

function App() {
  const [activeTab, setActiveTab] = useState("attendance");

  function renderActivePage() {
    switch (activeTab) {
      case "liveStatus":
        return <LiveStatusSection />;
      case "comparison":
        return <ComparisonPage />;
      case "lookup":
        return <LookupPage />;
      default:
        return <LiveStatusSection />;
    }
  }

  return (
    <div className="app-container">
      <main className="page-content">
        {renderActivePage()}
      </main>

      <AppMenuTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}

export default App;