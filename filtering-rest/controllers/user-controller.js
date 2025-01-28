// controllers/userController.js
const db = require('../models');
const bcrypt = require('bcrypt');

// Example: GET all users (admin only?)
exports.listUsers = async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error listing users' });
  }
};

// Example: Validate user credentials (internal use, or if you do REST-based auth)
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Invalid username/password" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid username/password" });
    }
    res.json({ message: "Login successful", user: { id: user.id, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during login" });
  }
};

// Example: create a new user
exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await db.User.create({
      username,
      password: hashed,
      role: role || 'user'
    });
    res.json({ message: "User created", user: { id: newUser.id, username: newUser.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
};
