import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';
import logoImage from '../assets/logo.png'; 

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);
  

  return (
    <div className="landing-page">
      <div className="landing-content">
        
        <div className="content-left">
          <h1 className="hero-title">The Art of <br /><span>Productivity</span></h1>
          <p className="hero-description">
            Manage your daily tasks with ease.
            Our platform helps you stay organized, 
            focused, and productive every single day.
          </p>
          
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/signup')}>
              GET STARTED
            </button>
            <button className="btn-secondary" onClick={() => navigate('/login')}>
              LOGIN
            </button>
          </div>
        </div>

        <div className="content-right">
          <img src={logoImage} alt="Task Management Illustration" className="hero-image" />
        </div>

      </div>
    </div>
  );
};

export default Landing;