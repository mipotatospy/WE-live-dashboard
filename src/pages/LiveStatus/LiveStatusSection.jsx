import { useState } from "react";
import LiveStatusTabBar from "/src/components/navigation/LiveStatusTabBar.jsx";
import AttendanceStatusPage from "./AttendanceStatusPage.jsx";
import LiveTrendPage from "./LiveTrendPage.jsx";
import './LiveStatusSection.css';

function LiveStatusSection() {
    const [activeTab, setActiveTab] = useState("attendance");

    function renderActiveTab() {
        switch (activeTab) {
            case "attendance":
                return <AttendanceStatusPage />;
            case "trend":
                return <LiveTrendPage />;
            default:
                return <AttendanceStatusPage />;
        }
    }

    return (
        <div className="live-status-section">
            <div className="live-status-tab-wrapper">
                <LiveStatusTabBar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                />
            </div>
        
            <div className="live-status-tab-content">
                {renderActiveTab()}
            </div>
        </div>
    );
}

export default LiveStatusSection;