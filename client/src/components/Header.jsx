import React from 'react';
import { Link , useNavigate} from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ onMenuClick , setUser}) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    if (setUser) setUser(null);
    navigate('/');
  };

  return (
    <header className="main-header">
      <button className="menu-button" onClick={onMenuClick}>
        ☰
      </button>

      <Link to="/" className="header-title-link">
        <h1 className="header-title">{user ? `${user.fullName}'s` : 'My'} TO DO LIST</h1>
      </Link>

      {user ? (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <div className="header-spacer"></div>
      )}

      <div className="header-spacer"></div> 
    </header>
  );
};

export default Header;