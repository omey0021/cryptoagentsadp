require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const marketRoutes = require('./routes/market');
const airdropRoutes = require('./routes/airdrops');
const agentRoutes = require('./routes/agents');
const newsRoutes = require('./routes/news');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'https://cryptoagentsadp.xyz', 'https://www.cryptoagentsadp.xyz', 'https://cryptoagentsadp.onrender.com'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimiter(100, 60000));

app.use(express.static('public'));

app.use('/api', marketRoutes);
app.use('/api', airdropRoutes);
app.use('/api', agentRoutes);
app.use('/api', newsRoutes);

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;