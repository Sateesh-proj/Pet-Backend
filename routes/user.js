const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, email, password, phone } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User with same email id already exists' });
    }
    const newUser = new User({ username, email, password, phone });
    await newUser.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).send('Error registering the user ');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User with the entered email id not found');
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('In-Correct Password. Please try with appropriate Password ');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token, user: { name: user.username, email: user.email } });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

module.exports = router;
