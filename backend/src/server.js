require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const marketRoutes = require('./routes/market');
const airdropRoutes = require('./routes/airdrops');
const agentRoutes = require('./routes/agents');
const newsRoutes = require('./routes/news');
const newsSentimentRoutes = require('./routes/news-sentiment');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'https://cryptoagentsadp.xyz', 'https://www.cryptoagentsadp.xyz', 'https://cryptoagentsadp-api.onrender.com', 'https://cryptoagentsadp-all.onrender.com'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimiter(100, 60000));

app.use('/api', marketRoutes);
app.use('/api', airdropRoutes);
app.use('/api', agentRoutes);
app.use('/api', newsRoutes);
app.use('/api/news-sentiment', newsSentimentRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;