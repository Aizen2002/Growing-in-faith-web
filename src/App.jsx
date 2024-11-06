import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './Components/LoginRegister/LoginRegister';
import Teachers from './Teachers';
import SuperAdmin from './SuperAdmin';
import Student from './Student';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginRegister />} />
        {/* SuperAdmin is now a layout with nested routes */}
        <Route path="/super-admin/*" element={<SuperAdmin />} />
        <Route path="/teacher/*" element={<Teachers />} />
        <Route path="/student/*" element={<Student />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
