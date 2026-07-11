const { Router } = require('express');
const { getPrices, getCoinDetail, getGlobalData } = require('../services/coingecko');

const router = Router();

router.get('/prices', async (req, res, next) => {
  try {
    const prices = await getPrices();
    res.json({ success: true, data: prices, count: prices.length });
  } catch (err) {
    next(err);
  }
});

router.get('/prices/:id', async (req, res, next) => {
  try {
    const detail = await getCoinDetail(req.params.id);
    res.json({ success: true, data: detail });
  } catch (err) {
    if (err.message?.includes('404') || err.response?.status === 404) {
      return res.status(404).json({ success: false, error: 'Coin not found' });
    }
    next(err);
  }
});

router.get('/global', async (req, res, next) => {
  try {
    const global = await getGlobalData();
    res.json({ success: true, data: global });
  } catch (err) {
    next(err);
  }
});

module.exports = router;