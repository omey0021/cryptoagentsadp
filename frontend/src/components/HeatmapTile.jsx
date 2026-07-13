import React, { useMemo } from 'react'
import { Tooltip } from 'react-tooltip'

function formatMarketCap(v) {
  if (!v) return '-'
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`
  return `$${Number(v).toLocaleString()}`
}

const COIN_COLORS = {
  'btc': { base: '#F7931A', name: 'Bitcoin' }, 'eth': { base: '#627EEA', name: 'Ethereum' },
  'usdt': { base: '#26A17B', name: 'Tether' }, 'bnb': { base: '#F3BA2F', name: 'BNB' },
  'sol': { base: '#9945FF', name: 'Solana' }, 'xrp': { base: '#23292F', name: 'XRP' },
  'usdc': { base: '#2775CA', name: 'USD Coin' }, 'steth': { base: '#00A3FF', name: 'Lido Staked ETH' },
  'doge': { base: '#C2A633', name: 'Dogecoin' }, 'ada': { base: '#0033AD', name: 'Cardano' },
  'trx': { base: '#EF0027', name: 'TRON' }, 'avax': { base: '#E84142', name: 'Avalanche' },
  'shib': { base: '#FFA409', name: 'Shiba Inu' }, 'dot': { base: '#E6007A', name: 'Polkadot' },
  'link': { base: '#2A5ADA', name: 'Chainlink' }, 'matic': { base: '#8247E5', name: 'Polygon' },
  'wbtc': { base: '#F7931A', name: 'Wrapped Bitcoin' }, 'dai': { base: '#F5AC37', name: 'Dai' },
  'uni': { base: '#FF007A', name: 'Uniswap' }, 'ltc': { base: '#345D9D', name: 'Litecoin' },
  'atom': { base: '#2E3148', name: 'Cosmos' }, 'etc': { base: '#34BE5E', name: 'Ethereum Classic' },
  'xlm': { base: '#14B4E4', name: 'Stellar' }, 'near': { base: '#000000', name: 'NEAR Protocol' },
  'apt': { base: '#18B9A0', name: 'Aptos' }, 'inj': { base: '#00F2FE', name: 'Injective' },
  'op': { base: '#FF0420', name: 'Optimism' }, 'stx': { base: '#5546FF', name: 'Stacks' },
  'ldo': { base: '#00A3FF', name: 'Lido DAO' }, 'crv': { base: '#FF0000', name: 'Curve DAO' },
  'algo': { base: '#000000', name: 'Algorand' }, 'arb': { base: '#2D374B', name: 'Arbitrum' },
  'ape': { base: '#0052FF', name: 'ApeCoin' }, 'axs': { base: '#0052FF', name: 'Axie Infinity' },
  'sand': { base: '#00AEEF', name: 'The Sandbox' }, 'mana': { base: '#FF2D55', name: 'Decentraland' },
  'gala': { base: '#00BFFF', name: 'Gala' }, 'rune': { base: '#00FFFF', name: 'THORChain' },
  'fet': { base: '#1E1E1E', name: 'Fetch.ai' }, 'agix': { base: '#6A0DAD', name: 'SingularityNET' },
  'ocean': { base: '#0099D8', name: 'Ocean Protocol' }, 'pepe': { base: '#33A532', name: 'Pepe' },
  'wif': { base: '#FF8C00', name: 'dogwifhat' }, 'render': { base: '#00B4D8', name: 'Render' },
  'sui': { base: '#4DA2FF', name: 'Sui' }, 'tia': { base: '#7B2FBE', name: 'Celestia' },
  'sei': { base: '#8B5CF6', name: 'Sei' }, 'bch': { base: '#0AC18E', name: 'Bitcoin Cash' },
  'hbar': { base: '#03C8FF', name: 'Hedera' }, 'icp': { base: '#3B00B9', name: 'Internet Computer' },
  'fil': { base: '#0090FF', name: 'Filecoin' }, 'apt': { base: '#18B9A0', name: 'Aptos' },
  'imx': { base: '#1A1B1F', name: 'Immutable' }, 'cronos': { base: '#002D74', name: 'Cronos' },
  'ton': { base: '#0088CC', name: 'Toncoin' }, 'theta': { base: '#2AB8E6', name: 'Theta' },
  'egld': { base: '#23F7DD', name: 'MultiversX' }, 'vet': { base: '#158BFF', name: 'VeChain' },
  'klay': { base: '#FF4500', name: 'Klaytn' }, 'xmr': { base: '#FF6600', name: 'Monero' },
  'blur': { base: '#FF4500', name: 'Blur' }, 'ldo': { base: '#00A3FF', name: 'Lido DAO' },
}

function getCoinColor(symbol) {
  const key = symbol?.toLowerCase() || ''
  if (COIN_COLORS[key]) return COIN_COLORS[key].base
  const hash = key.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const hue = hash % 360
  return `hsl(${hue}, 70%, 50%)`
}

export default function HeatmapTile({ coin, maxCap, onClick }) {
  const pct = coin.price_change_percentage_24h ?? 0
  const sizeRatio = coin.market_cap ? Math.max(0.35, Math.min(1, coin.market_cap / maxCap)) : 0.35
  const area = Math.round(90 + (220 * sizeRatio))
  const fontSize = Math.max(10, Math.round(10 + (6 * sizeRatio)))
  const baseColor = getCoinColor(coin.symbol)

  const isPositive = pct >= 0
  const absPct = Math.min(Math.abs(pct || 0), 50)
  const intensity = absPct / 50

  const innerShadow = useMemo(() => {
    const x = (Math.random() - 0.5) * 6
    const y = (Math.random() - 0.5) * 6
    return { x, y }
  }, [])

  return (
    <>
      <button
        data-tooltip-id={`tooltip-${coin.id}`}
        onClick={() => onClick(coin)}
        className="relative flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.06] hover:-translate-y-1 focus:outline-none"
        style={{
          width: `${area}px`,
          height: `${area}px`,
          minWidth: '80px',
          minHeight: '80px',
          perspective: '600px',
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl transition-all duration-500"
          style={{
            background: `
              radial-gradient(circle at 30% 25%, rgba(255,255,255,0.25), transparent 60%),
              radial-gradient(circle at 70% 80%, rgba(0,0,0,0.15), transparent 50%),
              linear-gradient(135deg, ${baseColor}dd, ${baseColor}88)
            `,
            boxShadow: `
              ${innerShadow.x}px ${innerShadow.y}px 30px rgba(0,0,0,0.15),
              0 8px 32px ${baseColor}33,
              inset 0 1px 0 rgba(255,255,255,0.3),
              inset 0 -2px 0 rgba(0,0,0,0.1)
            `,
            border: `1px solid ${baseColor}55`,
            transform: `rotateX(8deg) rotateY(${isPositive ? -4 : 4}deg)`,
            transformStyle: 'preserve-3d',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl opacity-60"
            style={{
              background: `linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)`,
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-2xl opacity-40"
            style={{
              background: `linear-gradient(0deg, rgba(0,0,0,0.2) 0%, transparent 100%)`,
            }}
          />
        </div>

        <div className="relative flex flex-col items-center z-10" style={{ transform: 'translateZ(20px)' }}>
          {coin.image && (
            <img src={coin.image} alt="" className="rounded-full mb-1" style={{
              width: `${Math.max(18, fontSize + 4)}px`,
              height: `${Math.max(18, fontSize + 4)}px`,
              boxShadow: `0 2px 12px ${baseColor}44`,
              filter: 'brightness(1.05)',
            }} />
          )}
          <span
            className="font-bold uppercase leading-tight text-center"
            style={{
              fontSize: `${fontSize}px`,
              color: '#ffffff',
              textShadow: '0 1px 6px rgba(0,0,0,0.4)',
            }}
          >
            {coin.symbol}
          </span>
          <span
            className="font-semibold mt-0.5"
            style={{
              fontSize: `${Math.max(9, fontSize - 3)}px`,
              color: isPositive ? '#00FF88' : '#FF4466',
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}
          >
            {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
          </span>
        </div>

        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-3 rounded-full opacity-20 blur-md transition-all duration-500"
          style={{ background: baseColor, transform: 'rotateX(60deg) translateZ(-10px)' }}
        />
      </button>

      <Tooltip
        id={`tooltip-${coin.id}`}
        place="top"
        variant="light"
        className="z-50 !rounded-xl !p-0 !opacity-100 !shadow-xl"
        style={{
          background: `${baseColor}ee`,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${baseColor}66`,
          borderRadius: '16px',
          color: '#ffffff',
          boxShadow: `0 16px 48px ${baseColor}33`,
        }}
      >
        <div className="flex items-start gap-3 p-3 min-w-[200px]">
          {coin.image && (
            <img src={coin.image} alt="" className="w-10 h-10 rounded-full mt-0.5" style={{ boxShadow: `0 2px 8px ${baseColor}44` }} />
          )}
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-base text-white">{coin.name}</span>
            <span className="text-xs text-white/60 uppercase">{coin.symbol}</span>
            <span className="text-sm font-semibold text-white/90 mt-1">
              ${coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
            </span>
            <span className={`text-sm font-bold ${isPositive ? 'text-[#00FF88]' : 'text-[#FF4466]'}`}>
              {pct >= 0 ? '+' : ''}{pct.toFixed(2)}% 24h
            </span>
            <span className="text-xs text-white/60 mt-0.5">MCap: {formatMarketCap(coin.market_cap)}</span>
          </div>
        </div>
      </Tooltip>
    </>
  )
}