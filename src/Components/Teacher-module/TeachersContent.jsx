import React from 'react';
import TeachersContentHeader from './TeachersContentHeader';
import TeacherDashboard from './TeacherDashboard';
import TeacherAbout from './TeacherAbout';
import StudentRegistration from './StudentRegistration';
import TeacherProfile from './TeacherProfile';
import TeacherStudentAssessment from './TeacherStudentAssessment';
import '../../styles/teachersContent.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

const TeachersContent = () => {
  const location = useLocation();

  console.log("Rendering Content component with path:", location.pathname);

  const getTitle = () => {
    switch (location.pathname) {
      case '/teacher/teacher-dashboard':
        return 'Dashboard';
      case '/teacher/teacher-assessment': // Ensure paths match
        return 'Assessment';
      case '/teacher/teacher-about':
        return 'About';
      case '/teacher/student-register':
        return 'Student Registration';
      case '/teacher/teacher-profile':
        return 'Profile';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className='teachers-content'>
      <TeachersContentHeader title={getTitle()} /> {/* Pass title as a prop */}
      <Routes>
        {/* Redirect the base path to the TeacherDashboard */}
        <Route path="/" element={<Navigate to="/teacher/teacher-dashboard" />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher-assessment" element={<TeacherStudentAssessment />} />
        <Route path="/teacher-about" element={<TeacherAbout />} />
        <Route path="/student-register" element={<StudentRegistration />} />
        <Route path="/teacher-profile" element={<TeacherProfile />} />
      </Routes>
    </div>
  );
};

export default TeachersContent;
