const express = require('express');
const pool = require('../../config');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Get inquiries for the admin dashboard
router.get('/inquiries', authMiddleware, async (req, res) => {
  try {
    const { category, user_type, search, status, page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

    const conditions = [];
    const values = [];

    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }

    if (user_type) {
      values.push(user_type);
      conditions.push(`user_type = $${values.length}`);
    }

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (search) {
      values.push(`%${search}%`);
      conditions.push(`(name ILIKE $${values.length} OR phone ILIKE $${values.length})`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM public.inquiries ${whereClause}`,
      values
    );

    const offset = (pageNumber - 1) * pageSize;

    const dataValues = [...values, pageSize, offset];

    const result = await pool.query(
      `SELECT id, name, phone, email, user_type, category,
              created_at, status, message
       FROM public.inquiries
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${dataValues.length - 1}
       OFFSET $${dataValues.length}`,
      dataValues
    );

    res.json({
      inquiries: result.rows,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total: Number(countResult.rows[0].count),
      },
    });
  } catch (error) {
    console.error('Dashboard inquiries error:', error.message);
    res.status(500).json({
      message: 'Unable to fetch inquiries',
    });
  }
});

// Update inquiry status
router.patch('/inquiries/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['New', 'Contacted', 'Resolved'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
      });
    }

    const result = await pool.query(
      `UPDATE public.inquiries
       SET status = $1
       WHERE id = $2
       RETURNING id, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Inquiry not found',
      });
    }

    res.json({
      message: 'Status updated successfully',
      inquiry: result.rows[0],
    });
  } catch (error) {
    console.error('Status update error:', error.message);

    res.status(500).json({
      message: 'Unable to update status',
    });
  }
});

module.exports = router;
