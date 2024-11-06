import React from 'react';
import StudentContentHeader from './StudentContentHeader';
import StudentDashboard from './StudentDashboard';
import StudentAbout from './StudentAbout';
import StudentProfile from './StudentProfile';
import '../../styles/studentContent.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import StudentAssessment from './StudentAssessment';

const StudentContent = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/student/student-dashboard':
        return 'Dashboard';
      case '/student/student-assessment': // Ensure paths match
        return 'Student Assessment';
      case '/student/student-about':
        return 'About';
      case '/student/student-profile':
        return 'Profile';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className='student-content'>
      <StudentContentHeader title={getTitle()} /> {/* Pass title as a prop */}
      <Routes>
        {/* Redirect base route /student to /student-dashboard */}
        <Route path="/" element={<Navigate to="/student/student-dashboard" replace />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-assessment" element={<StudentAssessment />} />
        <Route path="/student-about" element={<StudentAbout />} />
        <Route path="/student-profile" element={<StudentProfile />} />
      </Routes>
    </div>
  );
};

export default StudentContent;
