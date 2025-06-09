import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state passed during navigation or set defaults
  const { username, showToast } = location.state || { username: 'Guest', showToast: false };

  useEffect(() => {
    // Check if the welcome toast should be displayed
    const hasShownToast = sessionStorage.getItem('welcomeToastShown');
    if (showToast && !hasShownToast) {
      toast.success(`Welcome, ${username}!`, { position: 'top-center', autoClose: 5000 });
      sessionStorage.setItem('welcomeToastShown', 'true'); // Prevent future toasts
    }
  }, [showToast, username]);

  const handleLogout = () => {
    sessionStorage.removeItem('welcomeToastShown'); // Clear toast flag on logout
    navigate('/login');
  };

  const navigateToCodeEditor = () => {
    navigate('/code-editor');
  };

  return (
    <div className="home-container">
      <ToastContainer />
      <nav className="home-navbar">
        <div className="nav-item" onClick={navigateToCodeEditor}>
          <img src="code-logo.png" alt="Code Here" className="nav-icon" />
          <span className="nav-text">Code Here</span>
        </div>
        <div className="nav-item">
          <img src="store-logo.png" alt="My Store" className="nav-icon" />
          <span className="nav-text">My Store</span>
        </div>
        <div className="nav-item">
          <img src="ask-logo.png" alt="Ask Me" className="nav-icon" />
          <span className="nav-text">Ask Me</span>
        </div>
        <div className="nav-item">
          <img src="profile-logo.png" alt="Profile" className="nav-icon" />
          <span className="nav-text">Profile</span>
        </div>
        <div className="nav-item">
          <img src="connect-logo.png" alt="Connect Here" className="nav-icon" />
          <span className="nav-text">Connect</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <div className="home-content">
        <h1>Welcome, <span className="username">{username}</span>!</h1>
        <p className="home-subtext">Explore your dashboard and take actions!</p>
      </div>
    </div>
  );
};

export default Home;
