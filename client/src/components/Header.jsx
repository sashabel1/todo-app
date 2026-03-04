import React from 'react';
import '../styles/Header.css';

const Header = ({ onMenuClick }) => {
  return (
    <header className="main-header">
      <button className="menu-button" onClick={onMenuClick}>
        ☰
      </button>
      <h1 className="header-title">MY TO DO LIST</h1>
      <div className="header-spacer"></div> 
    </header>
  );
};

export default Header;