import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams(); // Extract token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!', { position: 'top-center', autoClose: 5000 });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: password }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Password reset successful! Redirecting to login...', {
          position: 'top-center',
          autoClose: 5000,
        });
        setTimeout(() => navigate('/login'), 5000);
      } else {
        toast.error(data.message || 'Reset failed. Try again!', { position: 'top-center', autoClose: 5000 });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again!', { position: 'top-center', autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <ToastContainer />
      <div className="reset-password-card">
        <h2>Reset Password</h2>
        <p>Enter your new password below:</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
