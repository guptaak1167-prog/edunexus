require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const pool = require('./config');

const inquiryRoutes = require('./src/routes/inquiry.routes');
const adminRoutes = require('./src/routes/admin.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');

const app = express();

// Trust Render's reverse proxy in production
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Home route
app.get('/', (req, res) => {
  res.send('EdTech CRM backend is running!');
});

// Database health check
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');

    res.json({
      message: 'Backend and Supabase connected successfully',
      databaseTime: result.rows[0].current_time,
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);

    res.status(500).json({
      message: 'Database connection failed',
    });
  }
});

// Inquiry routes
app.use('/api/inquiries', inquiryRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Dashboard routes
app.use('/api/dashboard', dashboardRoutes);

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
