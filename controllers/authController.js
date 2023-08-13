const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// create token
const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, {
    expiresIn: '1d',
  });
};

// register new user

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // already exist ?
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already exist' });
    }

    // save
    const user = new User({ username, email, password });
    await user.save();

    // token generate
    const token = createToken(user);
    res.json(token);
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
};

// login

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //checl by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    //if email exist

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid Password' });
    }

    const token = createToken(user);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Error login user' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
