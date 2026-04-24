// import { useState } from "react";
// import AttendanceStatusPage from "./pages/LiveStatus/LiveStatusSection.jsx";
// import ComparisonPage from "./pages/Comparison/ComparisonPage.jsx";
// import LookupPage from "./pages/Lookup/LookupPage.jsx";
// import AppMenuTabBar from "./components/navigation/AppMenuTabBar.jsx";
// import "./App.css";
// import LiveStatusSection from "./pages/LiveStatus/LiveStatusSection.jsx";

// function App() {
//   const [activeTab, setActiveTab] = useState("attendance");

//   function renderActivePage() {
//     switch (activeTab) {
//       case "liveStatus":
//         return <LiveStatusSection />;
//       case "comparison":
//         return <ComparisonPage />;
//       case "lookup":
//         return <LookupPage />;
//       default:
//         return <LiveStatusSection />;
//     }
//   }

//   return (
//     <div className="app-container">
//       <main className="page-content">
//         {renderActivePage()}
//       </main>

//       <AppMenuTabBar
//         activeTab={activeTab}
//         onTabChange={setActiveTab}
//       />
//     </div>
//   );
// }

// export default App;

// src/App.js
import { useState } from "react";
import LoginPage from "./pages/Login/LoginPage.jsx"; // Ensure you've created this
import AttendanceStatusPage from "./pages/LiveStatus/LiveStatusSection.jsx";
import ComparisonPage from "./pages/Comparison/ComparisonPage.jsx";
import LookupPage from "./pages/Lookup/LookupPage.jsx";
import AppMenuTabBar from "./components/navigation/AppMenuTabBar.jsx";
import "./App.css";
import LiveStatusSection from "./pages/LiveStatus/LiveStatusSection.jsx";

function App() {
  const [activeTab, setActiveTab] = useState("attendance");
  const [loggedIn, setLoggedIn] = useState(false); // Track login status

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

  // Render login page if not logged in, otherwise render the app content
  return (
    <div className="app-container">
      {loggedIn ? (
        <>
          <main className="page-content">{renderActivePage()}</main>
          <AppMenuTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      ) : (
        <LoginPage setLoggedIn={setLoggedIn} /> // Pass setLoggedIn to handle login
      )}
    </div>
  );
}

export default App;