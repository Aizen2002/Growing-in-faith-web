import React from 'react';
import { Link } from 'react-router-dom';
import { BiBookAlt, BiStats, BiTask } from 'react-icons/bi';
import GIFLogo from '../assets/GIFLOGO.png';
import '../styles/sidebar.css';

const Sidebar = () => {
  const handleLogoClick = () => {
    window.location.reload();  // This will refresh the page
  };

  return (
    <div className='menu'>
      <div className="sa-logo" onClick={handleLogoClick}>
        <img src={GIFLogo} alt="Logo" className="logo-image" />

      </div>

      <div className="menu--list">
        <Link to="/super-admin" className='item'>
          <BiTask className='icon'/>
          Register a Teacher
        </Link>

        <Link to="/super-admin/registered-teachers" className='item'>
          <BiStats className='icon'/>
          Registered Teachers
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
