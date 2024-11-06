import React from 'react';
import { BiSearch, BiNotification } from 'react-icons/bi';

const TeachersContentHeader = ({ title }) => {
  return (
    <div className='content--header'>
      <h1 className="header--title">{title}</h1>

    </div>
  );
};

export default TeachersContentHeader;
