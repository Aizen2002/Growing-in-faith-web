import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './Components/LoginRegister/LoginRegister';
import Teachers from './Teachers';
import SuperAdmin from './SuperAdmin';
import Student from './Student';

// ProtectedRoute component to ensure that users can't access protected routes without logging in
const ProtectedRoute = ({ element, allowedRoles }) => {
  const teacherId = localStorage.getItem('teacherId');
  const studentId = localStorage.getItem('studentId');
  const email = localStorage.getItem('userEmail');  // Get userEmail from localStorage
  console.log('Superadmin email from localStorage:', email);  // Debugging step
  
  if (allowedRoles === 'teacher' && teacherId) {
    return element;
  }

  if (allowedRoles === 'student' && studentId) {
    return element;
  }

  if (allowedRoles === 'superadmin' && email === "dejesus.florenceayen.06@gmail.com") {
    return element;
  }

  return <Navigate to="/login" />;
};



function App() {
  // Handle logout by clearing the localStorage
  const handleLogout = () => {
    // Clear the relevant items in localStorage
    localStorage.removeItem('teacherId');
    localStorage.removeItem('studentId');
    localStorage.removeItem('userEmail'); // or any other login-related keys
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginRegister />} />
        
        {/* Protecting SuperAdmin route */}
        <Route 
          path="/super-admin/*" 
          element={<ProtectedRoute element={<SuperAdmin />} allowedRoles="superadmin" />} 
        />
        
        {/* Protecting Teacher route */}
        <Route 
          path="/teacher/*" 
          element={<ProtectedRoute element={<Teachers />} allowedRoles="teacher" />} 
        />
        
        {/* Protecting Student route */}
        <Route 
          path="/student/*" 
          element={<ProtectedRoute element={<Student />} allowedRoles="student" />} 
        />
        
        {/* Logout Route */}
        <Route path="/logout" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
