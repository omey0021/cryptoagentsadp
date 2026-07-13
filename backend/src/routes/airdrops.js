const { Router } = require('express');
const { airdropCache } = require('../services/cache');

const router = Router();

const AIRDROPS = [
  { id: 1, name: 'zkSync Era', description: 'ZK-rollup scaling solution for Ethereum — massive ecosystem airdrop for early users and developers', chain: 'Ethereum', category: 'L2', status: 'active', estimated_value: 2500, steps: ['Bridge ETH to zkSync', 'Use ecosystem dApps (SyncSwap, Mute)', 'Provide liquidity on SyncSwap', 'Mint zkSync native NFTs', 'Use zkSync official bridge'], start_date: '2026-06-15', end_date: '2026-08-15', link: 'https://zksync.io', logo: 'https://cryptologos.cc/logos/zksync-era-logo.png', difficulty: 'Medium', participants: '150K+' },
  { id: 2, name: 'LayerZero', description: 'Omnichain interoperability protocol — rewarding cross-chain activity and ZRO stakers', chain: 'Multi-chain', category: 'Infrastructure', status: 'active', estimated_value: 5000, steps: ['Bridge tokens across supported chains', 'Use Stargate Finance', 'Supply liquidity on LayerZero-based DEXs', 'Hold ZRO token', 'Deploy omnichain contracts'], start_date: '2026-06-01', end_date: '2026-09-01', link: 'https://layerzero.network', logo: 'https://cryptologos.cc/logos/layerzero-logo.png', difficulty: 'Hard', participants: '200K+' },
  { id: 3, name: 'StarkNet', description: 'Validity-rollup L2 for Ethereum — STRK token distribution to early adopters and developers', chain: 'Ethereum', category: 'L2', status: 'active', estimated_value: 1800, steps: ['Deploy contracts on StarkNet', 'Use StarkNet dApps (JediSwap, MySwap)', 'Bridge to StarkNet', 'Participate in StarkNet DeFi', 'Complete StarkNet quests'], start_date: '2026-05-01', end_date: '2026-10-01', link: 'https://starknet.io', logo: 'https://cryptologos.cc/logos/starknet-logo.png', difficulty: 'Hard', participants: '120K+' },
  { id: 4, name: 'Scroll', description: 'zkEVM-based L2 scaling — rewarding testnet participation and mainnet activity', chain: 'Ethereum', category: 'L2', status: 'active', estimated_value: 1500, steps: ['Bridge ETH to Scroll', 'Use Scroll dApps (Skimswap, Scroll Canvas)', 'Provide liquidity on Scroll DEXs', 'Mint Scroll native assets', 'Complete Scroll origins'], start_date: '2026-07-01', end_date: '2026-09-30', link: 'https://scroll.io', logo: 'https://cryptologos.cc/logos/scroll-logo.png', difficulty: 'Easy', participants: '180K+' },
  { id: 5, name: 'Linea', description: 'ConsenSys zkEVM L2 — Voyage program points convert to token allocation', chain: 'Ethereum', category: 'L2', status: 'active', estimated_value: 2000, steps: ['Bridge to Linea', 'Complete Linea Voyage quests', 'Use Linea ecosystem apps', 'Hold LINEA points', 'Invite friends to Linea'], start_date: '2026-06-15', end_date: '2026-12-31', link: 'https://linea.build', logo: 'https://cryptologos.cc/logos/linea-logo.png', difficulty: 'Easy', participants: '250K+' },
  { id: 6, name: 'Fuel', description: 'Modular execution layer — rewarding early users and testnet participants with FUEL tokens', chain: 'Ethereum', category: 'L2', status: 'upcoming', estimated_value: 3000, steps: ['Install Fuel wallet', 'Bridge to Fuel testnet', 'Deploy contracts on Fuel', 'Use Fuel dApps', 'Run a Fuel node'], start_date: '2026-08-01', end_date: '2026-11-01', link: 'https://fuel.network', logo: 'https://cryptologos.cc/logos/fuel-logo.png', difficulty: 'Medium', participants: '0' },
  { id: 7, name: 'Monad', description: 'High-performance EVM-compatible L1 — MON token airdrop for testnet users', chain: 'Monad', category: 'L1', status: 'upcoming', estimated_value: 4000, steps: ['Join Monad testnet', 'Run a validator node', 'Deploy smart contracts', 'Use Monad DeFi dApps', 'Complete Monad quests'], start_date: '2026-09-01', end_date: '2026-12-01', link: 'https://monad.xyz', logo: 'https://cryptologos.cc/logos/monad-logo.png', difficulty: 'Hard', participants: '0' },
  { id: 8, name: 'Berachain', description: 'L1 with liquidity consensus — BERA token to testnet and mainnet participants', chain: 'Berachain', category: 'L1', status: 'upcoming', estimated_value: 3500, steps: ['Get testnet BERA from faucet', 'Provide liquidity on Berachain', 'Stake in Berachain validators', 'Participate in Berachain governance', 'Deploy dApps on Berachain'], start_date: '2026-08-15', end_date: '2026-11-15', link: 'https://berachain.com', logo: 'https://cryptologos.cc/logos/berachain-logo.png', difficulty: 'Medium', participants: '0' },
  { id: 9, name: 'EigenLayer', description: 'Ethereum restaking protocol — EIGEN token to LRT depositors and AVS participants', chain: 'Ethereum', category: 'DeFi', status: 'active', estimated_value: 2800, steps: ['Deposit LST into EigenLayer', 'Delegate to an operator', 'Participate in AVS validation', 'Hold liquid restaking tokens', 'Stake in EigenLayer'], start_date: '2026-04-01', end_date: '2026-10-31', link: 'https://eigenlayer.xyz', logo: 'https://cryptologos.cc/logos/eigenlayer-logo.png', difficulty: 'Medium', participants: '300K+' },
  { id: 10, name: 'Base', description: 'Coinbase L2 built on OP Stack — rewarding Onchain Summer participants', chain: 'Ethereum', category: 'L2', status: 'active', estimated_value: 1200, steps: ['Bridge to Base', 'Use Base dApps', 'Mint Base native NFTs', 'Participate in Onchain Summer', 'Use Base social apps'], start_date: '2026-05-01', end_date: '2026-08-30', link: 'https://base.org', logo: 'https://cryptologos.cc/logos/base-logo.png', difficulty: 'Easy', participants: '500K+' },
  { id: 11, name: 'Blast', description: 'L2 with native yield — BLAST airdrop for bridge and dApp users', chain: 'Ethereum', category: 'L2', status: 'active', estimated_value: 2200, steps: ['Bridge ETH to Blast', 'Use Blast dApps', 'Earn Blast Points', 'Refer friends to Blast', 'Use Blast DEX'], start_date: '2026-06-01', end_date: '2026-09-15', link: 'https://blast.io', logo: 'https://cryptologos.cc/logos/blast-logo.png', difficulty: 'Easy', participants: '220K+' },
  { id: 12, name: 'Mode', description: 'OP Stack L2 with DeFi incentives — MODE token to early users', chain: 'Ethereum', category: 'L2', status: 'upcoming', estimated_value: 1000, steps: ['Bridge to Mode', 'Use Mode DeFi protocols', 'Stake MODE tokens', 'Participate in governance', 'Provide liquidity'], start_date: '2026-09-01', end_date: '2026-12-31', link: 'https://mode.network', logo: '', difficulty: 'Easy', participants: '0' },
  { id: 13, name: 'Mantle', description: 'Ethereum L2 with DAO governance — MNT staking rewards and ecosystem airdrop', chain: 'Ethereum', category: 'L2', status: 'active', estimated_value: 1600, steps: ['Bridge to Mantle', 'Use Mantle DeFi', 'Stake MNT in Mantle LSP', 'Participate in Mantle DAO', 'Use Mantle DEX'], start_date: '2026-04-15', end_date: '2026-08-15', link: 'https://mantle.xyz', logo: 'https://cryptologos.cc/logos/mantle-logo.png', difficulty: 'Medium', participants: '80K+' },
  { id: 14, name: 'Taiko', description: 'ZK-rollup based on Taiko protocol — TKO airdrop to testnet contributors', chain: 'Ethereum', category: 'L2', status: 'upcoming', estimated_value: 1700, steps: ['Run Taiko node', 'Use Taiko testnet', 'Bridge to Taiko', 'Deploy on Taiko', 'Mine Taiko blocks'], start_date: '2026-10-01', end_date: '2027-01-31', link: 'https://taiko.xyz', logo: '', difficulty: 'Hard', participants: '0' },
  { id: 15, name: 'Celestia', description: 'Modular data availability network — TIA staking rewards and ecosystem airdrops', chain: 'Celestia', category: 'Infrastructure', status: 'active', estimated_value: 3200, steps: ['Stake TIA tokens', 'Use Celestia-based rollups', 'Provide data availability', 'Participate in Celestia governance', 'Run a Celestia node'], start_date: '2026-03-01', end_date: '2026-12-31', link: 'https://celestia.org', logo: 'https://cryptologos.cc/logos/celestia-logo.png', difficulty: 'Medium', participants: '100K+' },
  { id: 16, name: 'Abstract', description: 'Consumer-focused L2 with integrated wallet — rewarding early adopters', chain: 'Ethereum', category: 'L2', status: 'upcoming', estimated_value: 2000, steps: ['Create Abstract wallet', 'Bridge to Abstract', 'Use Abstract apps', 'Complete Abstract quests', 'Invite friends'], start_date: '2026-10-01', end_date: '2027-01-31', link: 'https://abstract.xyz', logo: '', difficulty: 'Easy', participants: '0' },
  { id: 17, name: 'Story Protocol', description: 'IP infrastructure L1 — rewarding testnet and early community members', chain: 'Story', category: 'L1', status: 'upcoming', estimated_value: 5000, steps: ['Join Story testnet', 'Register IP assets', 'Use Story protocol', 'Contribute to ecosystem', 'Run a Story node'], start_date: '2026-11-01', end_date: '2027-03-31', link: 'https://storyprotocol.xyz', logo: '', difficulty: 'Hard', participants: '0' },
  { id: 18, name: 'Hyperliquid', description: 'Perp DEX L1 with HyperEVM — rewarding traders and stakers', chain: 'Hyperliquid', category: 'DeFi', status: 'active', estimated_value: 4500, steps: ['Deposit USDC to Hyperliquid', 'Trade on Hyperliquid', 'Stake HYPE tokens', 'Provide liquidity', 'Refer traders'], start_date: '2026-05-01', end_date: '2026-12-31', link: 'https://hyperliquid.xyz', logo: '', difficulty: 'Hard', participants: '50K+' },
];

router.get('/airdrops', (req, res) => {
  const { category, chain, status, difficulty, sort, search } = req.query;
  const cached = airdropCache.get('airdrops');
  const data = cached || AIRDROPS;

  let filtered = [...data];
  if (category && category !== 'all') filtered = filtered.filter(a => a.category?.toLowerCase() === category.toLowerCase());
  if (chain && chain !== 'all') filtered = filtered.filter(a => a.chain?.toLowerCase() === chain.toLowerCase());
  if (status && status !== 'all') filtered = filtered.filter(a => a.status === status);
  if (difficulty && difficulty !== 'all') filtered = filtered.filter(a => a.difficulty?.toLowerCase() === difficulty.toLowerCase());
  if (search) filtered = filtered.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()));

  if (sort === 'value_desc') filtered.sort((a, b) => (b.estimated_value || 0) - (a.estimated_value || 0));
  else if (sort === 'value_asc') filtered.sort((a, b) => (a.estimated_value || 0) - (b.estimated_value || 0));
  else if (sort === 'deadline') filtered.sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
  else if (sort === 'newest') filtered.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  const totalValue = filtered.reduce((sum, a) => sum + (a.estimated_value || 0), 0);
  const activeCount = filtered.filter(a => a.status === 'active').length;
  const upcomingCount = filtered.filter(a => a.status === 'upcoming').length;
  const uniqueChains = [...new Set(filtered.map(a => a.chain))];
  const uniqueCategories = [...new Set(filtered.map(a => a.category))];

  if (!cached) airdropCache.set('airdrops', AIRDROPS);

  res.json({
    success: true,
    data: filtered,
    count: filtered.length,
    insights: { totalValue, activeCount, upcomingCount, chains: uniqueChains, categories: uniqueCategories },
  });
});

router.get('/airdrops/calendar', (req, res) => {
  const cached = airdropCache.get('airdrops');
  const data = cached || AIRDROPS;
  const events = data.map(a => ({
    id: a.id,
    title: a.name,
    start: a.start_date,
    end: a.end_date,
    value: a.estimated_value,
    status: a.status,
    chain: a.chain,
  }));
  res.json({ success: true, data: events });
});

module.exports = router;