// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  listUsers,
  login,
  register
} = require('../controllers/user-controller');

router.get('/users', listUsers);
router.post('/login', login);
router.post('/register', register);

module.exports = router;
