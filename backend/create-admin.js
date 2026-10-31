require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./config');

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
    }

    if (password.length < 8) {
      throw new Error('Admin password must be at least 8 characters');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO public.admins (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email`,
      [email, passwordHash]
    );

    if (result.rowCount === 0) {
      console.log('An admin with this email already exists.');
    } else {
      console.log('Admin created:', result.rows[0].email);
    }
  } catch (error) {
    console.error('Admin creation failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

createAdmin();
