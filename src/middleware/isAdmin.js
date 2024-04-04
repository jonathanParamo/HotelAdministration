import pool from "../pool-management.js";

export const isAdmin = async (req, res, next) => {
  try {
    const { body: { user_id } } = req;
    const [result] = await pool.query('SELECT * FROM users WHERE user_id = ?', [user_id]);

    if (result.length === 0) {
      throw new Error('User not found.');
    }

    if (result[0].role !== 'admin') {
      throw new Error('Access forbidden. Only admins are allowed.');
    }

    next();
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};
