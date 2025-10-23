// src/pages/UserDashboard.jsx
import React, { useContext } from "react";
import { WalletContext } from "../context/WalletContext";

const UserDashboard = () => {
  const { account } = useContext(WalletContext);

  return (
    <div style={{ padding: 30, minHeight: "100vh", background: "#07000a", color: "#fff" }}>
      <h1>User Dashboard</h1>
      <p><strong>Your connected address:</strong></p>
      <pre style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8 }}>
        {account || "No account connected"}
      </pre>
      <p style={{ opacity: 0.8, marginTop: 16 }}>Later we’ll list elections and voting UI here.</p>
    </div>
  );
};

export default UserDashboard;
