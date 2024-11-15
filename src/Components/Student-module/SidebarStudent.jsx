import React from 'react';
import { BiBookAlt, BiStats, BiTask, BiHome, BiMessage, BiSolidReport } from 'react-icons/bi';
import '../../styles/sidebarstudent.css';
import { Link } from 'react-router-dom';
import LogoImage from '../../assets/GIFLOGO.png'; // Adjust path if needed

const SidebarStudent = () => {
  const handleLogoClick = () => {
    window.location.reload(); // Refresh the page when logo is clicked
  };

  return (
    <div className='menu'>
      <div className='ss-logo' onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src={LogoImage} alt="Logo" className="ss-logo-image" /> {/* Use image as logo */}
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
        {/* Add other student-specific links here */}
      </div>
    </div>
  );
};

export default SidebarStudent;
