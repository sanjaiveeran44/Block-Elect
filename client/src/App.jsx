import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import RegistrationPage from "./pages/RegistrationPage.jsx";
import ElectionDetailPage from "./pages/ElectionDetailPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import UserDashboardPage from "./pages/UserDashboardPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/user" element={<UserDashboardPage />} />
      <Route path="/election/:id" element={<ElectionDetailPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
