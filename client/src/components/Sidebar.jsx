import React from 'react';
//import '../styles/Sidebar.css'; 

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>×</button>
      <nav className="sidebar-nav">
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/">Logout</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;