import React from "react";
import "./AdminHeader.css";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const AdminHeader = ({ adminAddress, onLogout }) => {
  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <h2>Admin Dashboard</h2>
      </div>

      <div className="admin-header-right">
        <div className="admin-profile">
          <FaUserCircle className="admin-icon" />
          <div className="admin-info">
            <span className="admin-label">Admin</span>
            <span className="admin-address">
              {adminAddress
                ? `${adminAddress.slice(0, 6)}...${adminAddress.slice(-4)}`
                : "Not Connected"}
            </span>
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
