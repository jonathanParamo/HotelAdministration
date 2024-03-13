import bcrypt from 'bcrypt';
import pool from "../pool-management.js";
import jwt from 'jsonwebtoken';

function validateEmail(email) {
  const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  return regex.test(email);
}

export async function signupModel(Username, Password, Email) {
  try {
    if (!validateEmail(Email)) {
      throw new Error('Invalid email format.');
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [Email]);

    if (existingUser.length > 0) {
       throw new Error('User with this email already exists.');
    }

    const query = 'INSERT INTO users (Username, Password, Email) VALUES (?, ?, ?)';
    const values = [Username, hashedPassword, Email];

    const [result] = await pool.query(query, values);
    const [newUser] = await pool.query('SELECT * FROM users WHERE UserId = ?', [result.insertId]);

    const token = generateToken(newUser[0]);

    const response = {
      success: true,
      message: 'Registration successful',
      user: newUser[0],
      token,
    };

    delete response.user.Password;

    return response;
  } catch (error) {
    throw error;
  }
}

function generateToken(user) {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ userId: user.user_id, username: user.username }, secret, { expiresIn: '3h' });
}
