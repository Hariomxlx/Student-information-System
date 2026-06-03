import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Calendar from './pages/Calendar';
import Academics from './pages/Academics';
import Grievance from './pages/Grievance';
import Admin from './pages/Admin';
import Administration from './pages/Administration';
import MentorLayout from './pages/MentorLayout';
import MentorDashboard from './pages/MentorDashboard';
import MentorAttendance from './pages/MentorAttendance';
import MentorGrades from './pages/MentorGrades';
import MentorGrievances from './pages/MentorGrievances';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/administration" element={<Administration />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="academics" element={<Academics />} />
          <Route path="grievances" element={<Grievance />} />
          {/* Add more nested routes for Academics, Chat, etc. */}
          <Route path="*" element={<div>Module Under Construction</div>} />
        </Route>

        {/* Protected Mentor Routes */}
        <Route path="/mentor" element={<MentorLayout />}>
          <Route index element={<MentorDashboard />} />
          <Route path="attendance" element={<MentorAttendance />} />
          <Route path="grades" element={<MentorGrades />} />
          <Route path="grievances" element={<MentorGrievances />} />
          <Route path="chat" element={<Chat />} />
          <Route path="*" element={<div>Module Under Construction</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
