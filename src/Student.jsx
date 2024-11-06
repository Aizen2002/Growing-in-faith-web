import React from 'react';
import SidebarStudent from './Components/Student-module/SidebarStudent';
import StudentDashboard from './Components/Student-module/StudentDashboard'
import './styles/student.css'
import StudentContent from './Components/Student-module/StudentContent';

const Student = () => {
  return (
    <div className="student-dashboard">
      <SidebarStudent />
      <div className="student-dashboard--content">
        <StudentContent/>
      </div>
    </div>
  );
};

export default Student;
