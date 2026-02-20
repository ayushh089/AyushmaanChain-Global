// src/Components/HospitalLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Pages/Hospital/Sidebar";

const HospitalLayout = () => {
  const location = useLocation();
  
  // Don't show sidebar on dashboard or other tabs if you want
  const showSidebar = true; // Set to false if you want to hide sidebar completely

  return (
    <div className="flex">
      {showSidebar && <Sidebar />}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default HospitalLayout;