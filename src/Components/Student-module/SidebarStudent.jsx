import React from 'react';
import { BiBookAlt, BiStats, BiTask, BiHome, BiMessage, BiSolidReport } from 'react-icons/bi';
import '../../styles/sidebarstudent.css'
import { Link } from 'react-router-dom';

const SidebarStudent = () => {
  return (
    <div className='menu'>
      <div className='logo'>
        <BiBookAlt className='logo-icon' />
        <h2>Growing in Faith</h2>
      </div>
      <div className="menu--list">
        <Link to="/student/student-dashboard" className="item">
          <BiHome className="icon" />
          Dashboard
        </Link>
        <Link to="/student/student-assessment" className="item">
          <BiSolidReport className="icon" />
          Student Assessment
        </Link>
        <Link to="/student/student-about" className="item">
          <BiMessage className="icon" />
          About
        </Link>
        <Link to="/student/student-profile" className="item">
          <BiStats className="icon" />
          Profile
        </Link>
        {/* Add other teacher-specific links here */}
      </div>
    </div>
  );
};

export default SidebarStudent;
