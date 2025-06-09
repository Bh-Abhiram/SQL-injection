import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
    console.log('Remember Me:', e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Login successful!', { position: "top-center", autoClose: 5000 });

        // Navigate to the Home page, passing the username and showToast flag
        setTimeout(() => {
          navigate('/home', { state: { username: formData.username, showToast: true } });
        }, 5000); // Redirect after the toast disappears
      } else {
        toast.error('Invalid credentials!', { position: "top-center", autoClose: 5000 });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again!', { position: "top-center", autoClose: 5000 });
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                // required
              />
              <span
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '👁️' : '🙈'}
              </span>
            </div>
          </div>
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />{' '}
              Remember Me
            </label>
            <span
              className="forgot-password"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </span>
          </div>
          <button className="auth-btn" type="submit">
            Login
          </button>
          <p className="redirect-text">
            Don't have an account?{' '}
            <span
              className="redirect-link"
              onClick={() => navigate('/signup')}
            >
              Signup here!
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
