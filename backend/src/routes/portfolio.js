const { Router } = require('express');
const axios = require('axios');
const { priceCache } = require('../services/cache');

const router = Router();
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

async function fetchPrices() {
  const cached = priceCache.get('portfolioPrices');
  if (cached) return cached;
  const { data } = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
    params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 250, page: 1, sparkline: false },
    timeout: 10000,
  });
  const map = {};
  data.forEach(c => { map[c.symbol.toLowerCase()] = { id: c.id, price: c.current_price, name: c.name, image: c.image, marketCap: c.market_cap, change24h: c.price_change_percentage_24h }; });
  priceCache.set('portfolioPrices', map, 60);
  return map;
}

function parseManualHoldings(text) {
  const lines = text.trim().split('\n').filter(Boolean);
  const holdings = [];
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 2) continue;
    const amount = parseFloat(parts[0]);
    const symbol = parts[1].replace(/[,:$]/g, '').toLowerCase();
    if (isNaN(amount) || amount <= 0 || !symbol) continue;
    holdings.push({ symbol, amount });
  }
  return holdings;
}

const KNOWN_TOKENS = {
  'btc': { id: 'bitcoin', name: 'Bitcoin' }, 'eth': { id: 'ethereum', name: 'Ethereum' },
  'sol': { id: 'solana', name: 'Solana' }, 'xrp': { id: 'ripple', name: 'XRP' },
  'doge': { id: 'dogecoin', name: 'Dogecoin' }, 'ada': { id: 'cardano', name: 'Cardano' },
  'avax': { id: 'avalanche-2', name: 'Avalanche' }, 'dot': { id: 'polkadot', name: 'Polkadot' },
  'link': { id: 'chainlink', name: 'Chainlink' }, 'matic': { id: 'matic-network', name: 'Polygon' },
  'uni': { id: 'uniswap', name: 'Uniswap' }, 'atom': { id: 'cosmos', name: 'Cosmos' },
  'arb': { id: 'arbitrum', name: 'Arbitrum' }, 'op': { id: 'optimism', name: 'Optimism' },
  'apt': { id: 'aptos', name: 'Aptos' }, 'sui': { id: 'sui', name: 'Sui' },
  'near': { id: 'near', name: 'NEAR Protocol' }, 'fantom': { id: 'fantom', name: 'Fantom' },
  'cro': { id: 'crypto-com-chain', name: 'Cronos' }, 'vet': { id: 'vechain', name: 'VeChain' },
  'theta': { id: 'theta-token', name: 'Theta' }, 'fil': { id: 'filecoin', name: 'Filecoin' },
  'algo': { id: 'algorand', name: 'Algorand' }, 'egld': { id: 'elrond-erd-2', name: 'MultiversX' },
  'axs': { id: 'axie-infinity', name: 'Axie Infinity' }, 'sand': { id: 'the-sandbox', name: 'The Sandbox' },
  'mana': { id: 'decentraland', name: 'Decentraland' }, 'gala': { id: 'gala', name: 'Gala' },
  'ape': { id: 'apecoin', name: 'ApeCoin' }, 'stx': { id: 'blockstack', name: 'Stacks' },
  'inj': { id: 'injective-protocol', name: 'Injective' }, 'rune': { id: 'thorchain', name: 'THORChain' },
  'ldo': { id: 'lido-dao', name: 'Lido DAO' }, 'crv': { id: 'curve-dao-token', name: 'Curve DAO' },
  'blur': { id: 'blur', name: 'Blur' }, 'sei': { id: 'sei', name: 'Sei' },
  'tia': { id: 'celestia', name: 'Celestia' }, 'bnb': { id: 'binancecoin', name: 'BNB' },
  'pepe': { id: 'pepe', name: 'Pepe' }, 'wif': { id: 'dogwifcoin', name: 'dogwifhat' },
  'trx': { id: 'tron', name: 'TRON' }, 'ton': { id: 'the-open-network', name: 'Toncoin' },
  'shib': { id: 'shiba-inu', name: 'Shiba Inu' }, 'usdt': { id: 'tether', name: 'Tether' },
  'usdc': { id: 'usd-coin', name: 'USD Coin' }, 'dai': { id: 'dai', name: 'Dai' },
  'wbtc': { id: 'wrapped-bitcoin', name: 'Wrapped Bitcoin' }, 'ltc': { id: 'litecoin', name: 'Litecoin' },
  'bch': { id: 'bitcoin-cash', name: 'Bitcoin Cash' }, 'xlm': { id: 'stellar', name: 'Stellar' },
  'hbar': { id: 'hedera-hashgraph', name: 'Hedera' }, 'icp': { id: 'internet-computer', name: 'Internet Computer' },
  'etc': { id: 'ethereum-classic', name: 'Ethereum Classic' }, 'xmr': { id: 'monero', name: 'Monero' },
  'render': { id: 'render-token', name: 'Render' }, 'fet': { id: 'fetch-ai', name: 'Fetch.ai' },
  'agix': { id: 'singularitynet', name: 'SingularityNET' }, 'ocean': { id: 'ocean-protocol', name: 'Ocean Protocol' },
};

async function getHoldingPrice(symbol, prices) {
  const key = symbol.toLowerCase();
  if (prices[key]) return prices[key];
  if (KNOWN_TOKENS[key]) {
    try {
      const { data } = await axios.get(`${COINGECKO_BASE}/simple/price`, {
        params: { ids: KNOWN_TOKENS[key].id, vs_currencies: 'usd', include_24hr_change: 'true' },
        timeout: 5000,
      });
      const info = data[KNOWN_TOKENS[key].id];
      if (info) return { id: KNOWN_TOKENS[key].id, price: info.usd, name: KNOWN_TOKENS[key].name, change24h: info.usd_24h_change };
    } catch { }
  }
  return null;
}

router.post('/portfolio', async (req, res) => {
  try {
    const { wallet, holdings: manualText } = req.body;
    let holdings = [];

    if (manualText) {
      holdings = parseManualHoldings(manualText);
    } else if (wallet) {
      const addr = wallet.trim();
      if (/^0x[a-fA-F0-9]{40}$/.test(addr)) {
        try {
          const { data } = await axios.get(`https://api.ethplorer.io/getAddressInfo/${addr}`, {
            params: { apiKey: process.env.ETHPLORER_KEY || 'freekey' }, timeout: 8000,
          });
          const ethBalance = parseFloat(data.ETH?.balance || 0);
          if (ethBalance > 0) holdings.push({ symbol: 'ETH', amount: ethBalance });
          (data.tokens || []).forEach(t => {
            const sym = (t.tokenInfo?.symbol || '').toLowerCase();
            const bal = parseFloat(t.balance || 0) / Math.pow(10, t.tokenInfo?.decimals || 18);
            if (sym && bal > 0) holdings.push({ symbol: sym, amount: bal, contract: t.tokenInfo?.address });
          });
        } catch { }
      } else if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr)) {
        try {
          const { data } = await axios.get(`https://api.solscan.io/account/v2/tokens?address=${addr}`, {
            timeout: 8000,
          });
          (data.data || []).forEach(t => {
            const sym = (t.tokenInfo?.symbol || '').toLowerCase();
            const bal = parseFloat(t.amount || 0) / Math.pow(10, t.tokenInfo?.decimals || 9);
            if (sym && bal > 0) holdings.push({ symbol: sym, amount: bal });
          });
          const solBal = parseFloat(data?.data?.lamports || 0) / 1e9;
          if (solBal > 0) holdings.push({ symbol: 'SOL', amount: solBal });
        } catch { }
      }
    }

    if (!holdings.length) {
      return res.status(400).json({ error: 'No holdings detected. Enter wallet address or paste holdings (e.g., "2.5 BTC\\n10 ETH")' });
    }

    const prices = await fetchPrices();
    const enriched = [];
    let totalValue = 0;

    for (const h of holdings) {
      const priceInfo = await getHoldingPrice(h.symbol, prices);
      if (priceInfo) {
        const value = h.amount * priceInfo.price;
        totalValue += value;
        enriched.push({
          symbol: h.symbol.toUpperCase(),
          name: priceInfo.name || h.symbol.toUpperCase(),
          amount: h.amount,
          price: priceInfo.price,
          value,
          change24h: priceInfo.change24h,
          allocation: 0,
          image: priceInfo.image || null,
        });
      } else {
        enriched.push({
          symbol: h.symbol.toUpperCase(),
          name: h.symbol.toUpperCase(),
          amount: h.amount,
          price: 0,
          value: 0,
          change24h: null,
          allocation: 0,
          image: null,
        });
      }
    }

    enriched.forEach(h => { h.allocation = totalValue > 0 ? (h.value / totalValue) * 100 : 0; });
    enriched.sort((a, b) => b.value - a.value);

    res.json({
      success: true,
      data: {
        totalValue,
        holdings: enriched,
        count: enriched.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to analyze portfolio' });
  }
});

module.exports = router;