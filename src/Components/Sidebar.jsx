import React from 'react';
import { BiBookAlt, BiStats, BiTask } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = () => {
  return (
    <div className='menu'>
      <div className="logo">
        <BiBookAlt className='logo-icon'/>
        <h2>Growing in Faith</h2>
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
