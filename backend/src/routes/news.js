const { Router } = require('express');
const { newsCache } = require('../services/cache');

const router = Router();

const NEWS = [
  { id: 1, title: 'Bitcoin Surges Past $70,000 as ETF Inflows Accelerate', source: 'CoinDesk', date: '2026-07-11T08:30:00Z', url: 'https://coindesk.com', image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800', category: 'Markets', summary: 'Bitcoin breaks $70k for the first time in 2026 as spot ETFs see record daily inflows of $1.2 billion.' },
  { id: 2, title: 'Ethereum Layer-2 TVL Reaches All-Time High of $50B', source: 'The Block', date: '2026-07-10T14:00:00Z', url: 'https://theblock.co', image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800', category: 'Technology', summary: 'Ethereum L2 scaling solutions hit a combined $50B in total value locked, led by Arbitrum and Optimism.' },
  { id: 3, title: 'Fed Signals Potential Rate Cut, Crypto Markets Rally', source: 'Bloomberg', date: '2026-07-10T16:45:00Z', url: 'https://bloomberg.com', image: 'https://images.unsplash.com/photo-1616077168070-5cb5f5f0b3e4?w=800', category: 'Regulation', summary: 'Federal Reserve hints at easing monetary policy, sparking broad crypto market rally across majors and altcoins.' },
  { id: 4, title: 'Solana Overtakes Ethereum in Daily DEX Volume', source: 'CoinTelegraph', date: '2026-07-09T11:20:00Z', url: 'https://cointelegraph.com', image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800', category: 'Markets', summary: 'Solana-based decentralized exchanges process more daily volume than Ethereum for the first time.' },
  { id: 5, title: 'AI Agent Protocols See 300% Growth in Q2 2026', source: 'Messari', date: '2026-07-09T09:00:00Z', url: 'https://messari.io', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', category: 'AI', summary: 'Crypto AI agent protocols surge 300% in Q2 as autonomous trading and analytics gain mainstream adoption.' },
  { id: 6, title: 'Crypto Airdrop Season Returns: $2B in Unclaimed Tokens', source: 'Decrypt', date: '2026-07-08T13:30:00Z', url: 'https://decrypt.co', image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800', category: 'DeFi', summary: 'Over $2 billion in unclaimed airdrop tokens available across major protocols as airdrop season heats up.' },
  { id: 7, title: 'SEC Approves First Spot Ethereum ETF Options', source: 'Reuters', date: '2026-07-08T20:15:00Z', url: 'https://reuters.com', image: 'https://images.unsplash.com/photo-1616077168070-5cb5f5f0b3e4?w=800', category: 'Regulation', summary: 'SEC greenlights options trading on spot Ethereum ETFs, opening new institutional investment avenues.' },
  { id: 8, title: 'zkSync Era Mainnet Processes 10M Transactions in One Week', source: 'The Defiant', date: '2026-07-07T10:45:00Z', url: 'https://thedefiant.io', image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800', category: 'Technology', summary: 'zkSync Era hits 10 million weekly transactions, cementing its position as the leading ZK-rollup.' },
  { id: 9, title: 'Bittensor Network Reaches 50,000 Validator Nodes', source: 'CoinDesk', date: '2026-07-07T07:30:00Z', url: 'https://coindesk.com', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', category: 'AI', summary: 'Bittensor decentralized ML network reaches 50,000 validators as demand for decentralized AI compute grows.' },
  { id: 10, title: 'DeFi Lending Protocols Hit $80B in Total Value Locked', source: 'CoinTelegraph', date: '2026-07-06T15:00:00Z', url: 'https://cointelegraph.com', image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800', category: 'DeFi', summary: 'DeFi lending protocols reach $80 billion TVL, driven by yield optimization and restaking demand.' },
  { id: 11, title: 'OpenAI and Crypto Projects Partner on Decentralized AI Training', source: 'The Block', date: '2026-07-06T12:00:00Z', url: 'https://theblock.co', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', category: 'AI', summary: 'Major partnership between OpenAI and blockchain projects aims to decentralize AI model training infrastructure.' },
  { id: 12, title: 'Bitcoin Mining Difficulty Hits New Peak as Hashrate Soars', source: 'CoinDesk', date: '2026-07-05T09:15:00Z', url: 'https://coindesk.com', image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800', category: 'Mining', summary: 'Bitcoin mining difficulty reaches an all-time high as network hashrate continues to climb.' }
];

router.get('/news', async (req, res) => {
  const { category } = req.query;

  const cached = newsCache.get('news');
  if (cached) {
    let filtered = cached;
    if (category && category !== 'all') {
      filtered = cached.filter(n => n.category?.toLowerCase() === category.toLowerCase());
    }
    return res.json({ success: true, data: filtered, count: filtered.length });
  }

  let filtered = NEWS;
  if (category && category !== 'all') {
    filtered = NEWS.filter(n => n.category?.toLowerCase() === category.toLowerCase());
  }

  newsCache.set('news', NEWS);
  res.json({ success: true, data: filtered, count: filtered.length });
});

module.exports = router;