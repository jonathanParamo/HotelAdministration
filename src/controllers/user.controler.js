import { signupModel, signinModel } from "../models/user.model.js";

export async function signupController(req, res) {
  const { Username, Password, Email } = req.body;

  try {
    if (!Username || !Password || !Email) {
      return res.status(400).json({ error: 'All fields are required' });
    };

    const result = await signupModel(Username, Password, Email);

    res.json(result);
  } catch (error) {
    if (error.message === 'User with this email already exists.') {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error during signup.' });
  };
};

export async function signinController(req, res) {
  const { Password, Email } = req.body;

  try {
    if (!Password || !Email) {
      return res.status(400).json({ error: 'All fields are required' });
    };

    const result = await signinModel(Password, Email);

    res.json(result);
  } catch (error) {
    if (error.message === 'User with this email already exists.') {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error during signin.' });
  };
};
