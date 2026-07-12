const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'cryptoagentsadp-secret-key-change-in-production';
const USERS = [];

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const exists = USERS.find(u => u.email === email.toLowerCase());
  if (exists) return res.status(409).json({ error: 'Email already registered' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: USERS.length + 1, email: email.toLowerCase(), password: hashedPassword, createdAt: new Date().toISOString() };
  USERS.push(user);

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ success: true, data: { token, user: { id: user.id, email: user.email } } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const user = USERS.find(u => u.email === email.toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, data: { token, user: { id: user.id, email: user.email } } });
});

router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const user = USERS.find(u => u.id === decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ success: true, data: { id: user.id, email: user.email } });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;