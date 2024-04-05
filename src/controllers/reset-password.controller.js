import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../pool-management.js";

export async function resetPassword(req, res) {
  try {
    const { body: { password, token } } = req;
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    if (!userId) {
      throw new Error('Invalid token');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'UPDATE users SET password = ? WHERE user_id = ?';
    const values = [hashedPassword, userId];

    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) {
      throw new Error('User not found or password not updated');
    }

    res.status(201).json({ message: 'Password successfully updated' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
