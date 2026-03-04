import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="main-footer">
      <p>MADE BY SASHA © {currentYear}</p>
    </footer>
  );
};

export default Footer;