import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ onMenuClick }) => {
  return (
    <header className="main-header">
      <button className="menu-button" onClick={onMenuClick}>
        ☰
      </button>

      <Link to="/" className="header-title-link">
        <h1 className="header-title">MY TO DO LIST</h1>
      </Link>

      <div className="header-spacer"></div> 
    </header>
  );
};

export default Header;