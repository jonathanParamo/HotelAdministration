import pool from "../pool-management.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../mails/mails.js";

function validateEmail(email) {
  const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return regex.test(email);
}

export async function recoveryPassword(req, res) {
  try {
    const { body: { email } } = req;

    if (!validateEmail(email)) {
      throw new Error('Invalid email format.');
    }

    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length === 0) {
      throw new Error('User with this email does not exist.');
    }

    const user = existingUser[0];

    const token = generateToken(user);

    await sendMail(email, token);

    const message = `If your email is correct, in a few minutes you'll
      receive an email with a link to restore your password.
      You'll have 30 minutes to restore your password`;

    res.status(201).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

function generateToken(user) {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ userId: user.user_id, username: user.username }, secret, { expiresIn: '30m' });
}
