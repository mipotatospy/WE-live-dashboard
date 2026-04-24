// src/pages/Dashboard/DashboardPage.jsx
import React from "react";

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard!</h2>
      <p>This is a protected route that only shows after a successful login.</p>
    </div>
  );
};

export default DashboardPage;