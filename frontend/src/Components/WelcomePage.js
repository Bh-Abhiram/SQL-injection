import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <nav className="navbar">
        <div className="logo">SQLi</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#blog">Blog/News</a></li>
        </ul>
      </nav>

      <header className="welcome-header">
        <h1>Welcome to the demonstration of the SQLInjection</h1>
        <h4>**note:** This Demonstration is for educational purpose only</h4>
        <div className="buttons">
          <Link to="/signup">
            <button className="btn new-user">New User?</button>
          </Link>
          <Link to="/login">
            <button className="btn existing-user">Existing User?</button>
          </Link>
        </div>
      </header>
    </div>
  );
};

export default WelcomePage;
