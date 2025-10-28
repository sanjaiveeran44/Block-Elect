import React from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import AdminHero from '../components/admin/AdminHero';

function AdminDashboard() {

  const adminAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const handleView = (electionId) => {
    console.log("View clicked for election:", electionId);
  };

  const handleRemove = (electionId) => {
    console.log("Remove clicked for election:", electionId);
  };

  const handleCreate = (newElection) => {
    console.log("Create clicked with data:", newElection);
  };

  return(
    <div>
        <AdminHeader adminAddress={adminAddress} onLogout={handleLogout} />
        <AdminHero
      />
    </div>
  )
}

export default AdminDashboard