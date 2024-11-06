import React from 'react';
import { BiBookAlt, BiStats, BiTask, BiHome, BiMessage, BiSolidReport } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import '../../styles/sidebarteacher.css'; // Import a different CSS file if needed

const SidebarTeacher = () => {
  return (
    <div className='menu'>
      <div className='logo'>
        <BiBookAlt className='logo-icon' />
        <h2>Growing in Faith</h2>
      </div>
      <div className="menu--list">
        <Link to="/teacher/teacher-dashboard" className="item">
          <BiHome className="icon" />
          Dashboard
        </Link>
        <Link to="/teacher/teacher-assessment" className="item">
          <BiSolidReport className="icon" />
          Student Assessment
        </Link>
        <Link to="/teacher/student-register" className="item">
          <BiTask className="icon" />
          Student Registration
        </Link>
        <Link to="/teacher/teacher-about" className="item">
          <BiMessage className="icon" />
          About
        </Link>
        <Link to="/teacher/teacher-profile" className="item">
          <BiStats className="icon" />
          Profile
        </Link>
        {/* Add other teacher-specific links here */}
      </div>
    </div>
  );
};

export default SidebarTeacher;
