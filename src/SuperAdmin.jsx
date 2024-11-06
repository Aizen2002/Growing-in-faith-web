import React from 'react'
import Sidebar from './Components/Sidebar'
import Content from './Components/Content'
import './App.css'

const SuperAdmin = () => {
  return (
    <div className='dashboard'>
        <Sidebar />
        <div className="dashboard--content">
          <Content/>
        </div>
    </div>
  )
}

export default SuperAdmin