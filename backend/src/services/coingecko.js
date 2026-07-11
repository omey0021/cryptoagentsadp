const axios = require('axios');
const { priceCache } = require('./cache');

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

let requestQueue = [];
let processingQueue = false;

async function processQueue() {
  if (processingQueue) return;
  processingQueue = true;

  while (requestQueue.length > 0) {
    const { resolve, reject, fn } = requestQueue.shift();
    try {
      const result = await fn();
      resolve(result);
    } catch (err) {
      reject(err);
    }
    await new Promise(r => setTimeout(r, 1200));
  }

  processingQueue = false;
}

function enqueueRequest(fn) {
  return new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject, fn });
    processQueue();
  });
}

async function fetchWithRetry(url, params = {}) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { data } = await axios.get(url, { params, timeout: 10000 });
      return data;
    } catch (err) {
      lastError = err;
      if (err.response?.status === 429) {
        await new Promise(r => setTimeout(r, RETRY_DELAY * attempt * 2));
        continue;
      }
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, RETRY_DELAY));
      }
    }
  }
  throw new Error(lastError?.message || 'Request failed');
}

async function getPrices() {
  const cached = priceCache.get('top100');
  if (cached) return cached;

  return enqueueRequest(async () => {
    const data = await fetchWithRetry(`${COINGECKO_BASE}/coins/markets`, {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 100,
      page: 1,
      sparkline: false
    });

    const coins = data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
      total_volume: coin.total_volume,
      circulating_supply: coin.circulating_supply,
      total_supply: coin.total_supply,
      ath: coin.ath,
      ath_change_percentage: coin.ath_change_percentage,
      last_updated: coin.last_updated
    }));

    priceCache.set('top100', coins);
    return coins;
  });
}

async function getCoinDetail(id) {
  const cacheKey = `coin_${id}`;
  const cached = priceCache.get(cacheKey);
  if (cached) return cached;

  return enqueueRequest(async () => {
    const data = await fetchWithRetry(`${COINGECKO_BASE}/coins/${id}`, {
      localization: 'false',
      tickers: 'false',
      community_data: 'false',
      developer_data: 'false',
      sparkline: 'false'
    });

    const detail = {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      image: data.image?.large,
      description: data.description?.en?.split('.')[0] + '.',
      market_data: {
        current_price: data.market_data?.current_price?.usd,
        market_cap: data.market_data?.market_cap?.usd,
        market_cap_rank: data.market_data?.market_cap_rank,
        price_change_percentage_24h: data.market_data?.price_change_percentage_24h,
        price_change_percentage_7d: data.market_data?.price_change_percentage_7d,
        high_24h: data.market_data?.high_24h?.usd,
        low_24h: data.market_data?.low_24h?.usd,
        total_volume: data.market_data?.total_volume?.usd,
        circulating_supply: data.market_data?.circulating_supply,
        total_supply: data.market_data?.total_supply,
        ath: data.market_data?.ath?.usd,
        ath_change_percentage: data.market_data?.ath_change_percentage?.usd,
        ath_date: data.market_data?.ath_date?.usd
      },
      links: {
        homepage: data.links?.homepage?.[0],
        twitter: data.links?.twitter_screen_name,
        subreddit: data.links?.subreddit_url,
        github: data.links?.repos_url?.github?.[0]
      },
      last_updated: data.last_updated
    };

    priceCache.set(cacheKey, detail);
    return detail;
  });
}

async function getGlobalData() {
  const cached = priceCache.get('global');
  if (cached) return cached;

  return enqueueRequest(async () => {
    const data = await fetchWithRetry(`${COINGECKO_BASE}/global`);

    const global = {
      active_cryptocurrencies: data.data?.active_cryptocurrencies,
      total_market_cap: data.data?.total_market_cap?.usd,
      total_volume: data.data?.total_volume?.usd,
      btc_dominance: data.data?.market_cap_percentage?.btc,
      eth_dominance: data.data?.market_cap_percentage?.eth,
      market_cap_change_percentage_24h_usd: data.data?.market_cap_change_percentage_24h_usd,
      volume_change_percentage_24h: 0,
      last_updated: new Date().toISOString()
    };

    priceCache.set('global', global);
    return global;
  });
}

module.exports = { getPrices, getCoinDetail, getGlobalData };