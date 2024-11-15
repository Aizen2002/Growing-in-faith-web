import React from 'react';
import { BiBookAlt, BiStats, BiTask, BiHome, BiMessage, BiSolidReport } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import LogoImage from '../../assets/GIFLOGO.png'; // Adjust path if needed
import '../../styles/sidebarteacher.css';

const SidebarTeacher = () => {
  const handleLogoClick = () => {
    window.location.reload(); // This will refresh the page when the logo is clicked
  };

  return (
    <div className='menu'>
      <div className='st-logo' onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src={LogoImage} alt="Logo" className="st-logo-image" /> {/* Use the image as logo */}
      </div>
      <div className="menu--list">
        <Link to="/teacher/teacher-dashboard" className="item">
          <BiHome className="icon" />
          Dashboard
        </Link>
        <Link to="/teacher/teacher-assessment" className="item">
          <BiSolidReport className="icon" />
          Assessment
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
