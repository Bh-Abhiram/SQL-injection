const nodemailer = require('nodemailer');
const crypto = require('crypto');
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for all requests
app.use(cors());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'SQL',
    password: 'SQLinjection',
    database: 'SQLi',
    multipleStatements: true,
});

db.connect((err) => {
    if (err) {
        console.error("Could not connect to the database:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL database");
});

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other services like 'Yahoo', 'Outlook'
    auth: {
      user: 'bheemaraju.abhiram03@gmail.com',
      pass: 'hlkd olye qshh aaap', // Use environment variables for better security
    },
  });

// Vulnerable Registration Route
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Vulnerable SQL query
    const query = `INSERT INTO Users (username, email, password) VALUES ('${username}', '${email}', '${password}')`;

    console.log("Constructed Query (Registration):", query); // Log for demonstration

    db.query(query, (err) => {
        if (err) {
            console.error("Error during registration:", err);
            return res.status(500).json({ success: false, message: "Registration failed!" });
        }
        return res.json({ success: true, message: "Registration successful!" });
    });
});

// Vulnerable Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Vulnerable SQL query
    const query = `SELECT * FROM Users WHERE username = '${username}' AND password = '${password}'`;

    console.log("Constructed Query (Login):", query); // Log for demonstration

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error during login:", err);
            return res.status(500).json({ success: false, message: "Login failed!" });
        }

        if (results.length > 0) {
            return res.json({
                success: true,
                message: "Login successful!",
                user: results[0],
            });
        } else {
            return res.json({ success: false, message: "Invalid credentials!" });
        }
    });
});

// Forgot Password Endpoint
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  // Check if the email exists in the database
  const query = `SELECT * FROM Users WHERE email = ?`;
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: 'Email not found' });
    }

    // Generate a unique reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour expiry

    // Store the reset token and expiry in the database
    const updateQuery = `UPDATE Users SET resetToken = ?, resetTokenExpires = ? WHERE email = ?`;
    db.query(updateQuery, [resetToken, resetTokenExpires, email], (updateErr) => {
      if (updateErr) {
        console.error('Error updating reset token:', updateErr);
        return res.status(500).json({ success: false, message: 'Server error' });
      }

      // Send reset instructions via email
      const resetLink = `http://localhost:3001/reset-password/${resetToken}`;
      const mailOptions = {
        from: 'bheemaraju.abhiram03@gmail.com',
        to: email,
        subject: 'Password Reset Instructions',
        html: `
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>This link is valid for 1 hour. If you did not request a password reset, please ignore this email.</p>
        `,
      };

      transporter.sendMail(mailOptions, (mailErr, info) => {
        if (mailErr) {
          console.error('Error sending email:', mailErr);
          return res.status(500).json({ success: false, message: 'Error sending email' });
        }

        return res.json({
          success: true,
          message: 'Password reset instructions sent to your email',
        });
      });
    });
  });
});

// Reset Password Endpoint
app.post('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Validate the token and expiry
  const query = `SELECT * FROM Users WHERE resetToken = ? AND resetTokenExpires > NOW()`;
  db.query(query, [token], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Update the password and clear the reset token
    const updateQuery = `UPDATE Users SET password = ?, resetToken = NULL, resetTokenExpires = NULL WHERE resetToken = ?`;
    db.query(updateQuery, [newPassword, token], (updateErr) => {
      if (updateErr) {
        console.error('Error updating password:', updateErr);
        return res.status(500).json({ success: false, message: 'Server error' });
      }

      return res.json({ success: true, message: 'Password has been reset successfully' });
    });
  });
});
  
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
