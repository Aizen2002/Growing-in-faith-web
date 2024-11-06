import React, { useEffect } from 'react';
import ContentHeader from './ContentHeader';
import '../styles/content.css';
import RegisterTeacher from './RegisterTeacher';
import RegisteredTeachers from './RegisteredTeachers';
import { Routes, Route, useLocation } from 'react-router-dom';

const Content = () => {
  const location = useLocation();

  // Debug: Log when Content component renders
  console.log("Rendering Content component with path:", location.pathname);

  const getTitle = () => {
    switch (location.pathname) {
      case '/super-admin/registered-teachers':
        return 'Registered Teachers';
      case '/super-admin':
      default:
        return 'Register a Teacher';
    }
  };  

  return (
    <div className='content'>
      <ContentHeader title={getTitle()} />
      <Routes>
        <Route path="/" element={<RegisterTeacher />} />
        <Route path="/registered-teachers" element={<RegisteredTeachers />} />
      </Routes>
    </div>
  );
};

export default Content;
