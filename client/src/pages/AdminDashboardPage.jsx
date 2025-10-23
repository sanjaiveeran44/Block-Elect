import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletContext } from '../context/WalletContext.jsx';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const { account, connectWallet } = useContext(WalletContext);
  const navigate = useNavigate();

  const [adminAddress, setAdminAddress] = useState('0x1234567890abcdef1234567890abcdef12345678'); 
  const [elections, setElections] = useState([
    { id: 1, title: 'Presidential Election', description: 'Vote for your next president', status: 'Active' },
    { id: 2, title: 'Class Representative', description: 'Select your CR', status: 'Ended' },
  ]);

  useEffect(() => {
    if (!account) connectWallet();
  }, [account]);

  const handleCreateElection = () => {
    navigate('/admin/create-election');
  };

  const handleEndElection = (id) => {
    alert(`Election ${id} ended (dummy). Will connect to blockchain later.`);
  };

  const handleViewResults = (id) => {
    navigate(`/admin/election/${id}`);
  };

  const isAdmin = account && account.toLowerCase() === adminAddress.toLowerCase();

  if (!account) {
    return (
      <div className="admin-dashboard-container">
        <h2>Connect Wallet to Continue</h2>
        <button className="btn" onClick={connectWallet}>Connect MetaMask</button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-dashboard-container">
        <h2>Access Denied</h2>
        <p>Your wallet is not authorized as an admin.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <p className="wallet-display">Connected Admin: <span>{account}</span></p>

      <button className="create-btn" onClick={handleCreateElection}>+ Create New Election</button>

      <div className="elections-list">
        {elections.map((election) => (
          <div key={election.id} className="election-card">
            <h3>{election.title}</h3>
            <p>{election.description}</p>
            <span className={`status ${election.status.toLowerCase()}`}>
              {election.status}
            </span>
            <div className="actions">
              {election.status === 'Active' && (
                <button className="end-btn" onClick={() => handleEndElection(election.id)}>End Election</button>
              )}
              <button className="results-btn" onClick={() => handleViewResults(election.id)}>View Results</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
