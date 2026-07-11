const NodeCache = require('node-cache');

const priceCache = new NodeCache({ stdTTL: 120, checkperiod: 30 });
const newsCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
const airdropCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

function getCache(type) {
  switch (type) {
    case 'prices': return priceCache;
    case 'news': return newsCache;
    case 'airdrops': return airdropCache;
    default: return priceCache;
  }
}

module.exports = { getCache, priceCache, newsCache, airdropCache };