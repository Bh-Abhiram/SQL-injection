import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address!', {
        position: 'top-center',
        autoClose: 5000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Password reset instructions sent to your email!', {
          position: 'top-center',
          autoClose: 5000,
        });
        setEmail(''); // Clear the input
      } else {
        toast.error('Error sending reset instructions. Try again!', {
          position: 'top-center',
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again!', {
        position: 'top-center',
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <ToastContainer />
      <div className="forgot-password-card">
        <h2>Forgot Password</h2>
        <p>Enter your registered email to receive password reset instructions.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            className="reset-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Instructions'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
