
import React, { useContext } from "react";
import { WalletContext } from "../context/WalletContext";

const AdminDashboard = () => {
  const { account } = useContext(WalletContext);

  return (
    <div style={{ padding: 30, minHeight: "100vh", background: "#0b0014", color: "#fff" }}>
      <h1>Admin Dashboard</h1>
      <p><strong>Connected admin address:</strong></p>
      <pre style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8 }}>
        {account || "No account connected"}
      </pre>
      <p style={{ opacity: 0.8, marginTop: 16 }}>For now we just print the address. Admin actions come next.</p>
    </div>
  );
};

export default AdminDashboard;
