import React from 'react';
import SidebarTeacher from './Components/Teacher-module/SidebarTeacher';
import TeachersContent from './Components/Teacher-module/TeachersContent'
import './styles/teachers.css'

const Teachers = () => {
  return (
    <div className="teacher-dashboard">
      <SidebarTeacher />
      <div className="teacher-dashboard--content">
        <TeachersContent />
      </div>
    </div>
  );
};

export default Teachers;
