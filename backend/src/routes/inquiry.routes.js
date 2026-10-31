const express = require('express');
const pool = require('../../config');

const router = express.Router();

const USER_TYPES = ['Parent', 'Student', 'School'];

const CATEGORIES = ['Scholarship', 'Concert', 'Admission', 'General Query'];

router.post('/', async (req, res) => {
  try {
    const { user_type, category, name, email, phone, message } = req.body;

    if (!user_type || !category || !name || !email || !phone || !message) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    if (!USER_TYPES.includes(user_type)) {
      return res.status(400).json({
        message: 'Invalid user type',
      });
    }

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: 'Invalid category',
      });
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      !/^\+?[0-9\s()-]{7,20}$/.test(phone.trim()) ||
      name.trim().length > 100 ||
      email.trim().length > 255 ||
      message.trim().length === 0
    ) {
      return res.status(400).json({
        message: 'Please provide valid inquiry details',
      });
    }

    const result = await pool.query(
      `INSERT INTO public.inquiries
       (user_type, category, name, email, phone, message)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_type, category, name, email,
                 phone, message, status, created_at`,
      [user_type, category, name.trim(), email.trim().toLowerCase(), phone.trim(), message.trim()]
    );

    return res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiry: result.rows[0],
    });
  } catch (error) {
    console.error('Inquiry submission error:', error.message);

    return res.status(500).json({
      message: 'Unable to submit inquiry',
    });
  }
});

module.exports = router;
