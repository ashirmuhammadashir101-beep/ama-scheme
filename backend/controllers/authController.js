const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const db = require('../database');

const secret = process.env.JWT_SECRET || 'your_secret_key';

const register = (req, res) => {
  const { email, phone, password, fullname } = req.body;

  if (!email || !phone || !password || !fullname) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (email, phone, password, fullname) VALUES (?, ?, ?, ?)',
    [email, phone, hashedPassword, fullname],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email or phone already registered' });
        }
        return res.status(500).json({ error: 'Registration failed', message: err.message });
      }

      const token = jwt.encode(
        { id: this.lastID, email, isAdmin: false },
        secret
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: this.lastID, email, phone, fullname }
      });
    }
  );
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Login failed', message: err.message });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is admin
    db.get('SELECT * FROM admins WHERE user_id = ?', [user.id], (err, admin) => {
      const token = jwt.encode(
        { id: user.id, email: user.email, isAdmin: !!admin },
        secret
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          phone: user.phone,
          isAdmin: !!admin
        }
      });
    });
  });
};

module.exports = { register, login };
