import React from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import AdminHero from '../components/admin/AdminHero';

function AdminDashboard() {

  const adminAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const sampleElections = [
  {
    id: 1,
    title: "Student Council Election",
    startDate: "2025-10-10",
    endDate: "2025-10-20",
    active: true,
  },
  {
    id: 2,
    title: "Tech Lead Selection",
    startDate: "2025-09-01",
    endDate: "2025-09-05",
    active: false,
  },
];

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
        elections={sampleElections}
        onView={handleView}
        onRemove={handleRemove}
        onCreate={handleCreate}
      />
    </div>
  )
}

export default AdminDashboard