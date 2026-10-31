const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../../config');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

const isProduction = process.env.NODE_ENV === 'production';

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const result = await pool.query('SELECT * FROM public.admins WHERE email = $1', [
      email.trim().toLowerCase(),
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    // Set JWT in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });

    return res.json({
      message: 'Login successful',
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error.message);

    return res.status(500).json({
      message: 'Unable to log in',
    });
  }
});

// Verify logged-in admin
router.get('/me', authMiddleware, (req, res) => {
  return res.json({
    authenticated: true,
    admin: {
      id: req.admin.id,
      email: req.admin.email,
    },
  });
});

// Admin logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });

  return res.json({
    message: 'Logged out successfully',
  });
});

module.exports = router;
