import { INetwork } from "./types/networks";
import { BalanceOption } from "./types/balance";

export const networks: INetwork[] = [
  { id: 'eth', name: 'Ethereum', icon: '/images/chains/ethereum.png', chainId: 1, nativeCurrency: 'ETH', explorerUrl: 'https://etherscan.io' },
  { id: 'eth-holesky', name: 'Holesky', icon: '/images/chains/ethereum.png', chainId: 17000, nativeCurrency: 'ETH', explorerUrl: 'https://holesky.etherscan.io' },
  { id: 'bnb', name: 'BNB Chain', icon: '/images/chains/bnbchain.png', chainId: 56, nativeCurrency: 'BNB', explorerUrl: 'https://bscscan.com' },
  { id: 'polygon', name: 'Polygon', icon: '/images/chains/polygon.png', chainId: 137, nativeCurrency: 'MATIC', explorerUrl: 'https://polygonscan.com' },
  { id: 'avalanche', name: 'Avalanche', icon: '/images/chains/avalanche.png', chainId: 43114, nativeCurrency: 'AVAX', explorerUrl: 'https://snowtrace.io' },
  { id: 'arbitrum', name: 'Arbitrum One', icon: '/images/chains/arbitrum.png', chainId: 42161, nativeCurrency: 'ETH', explorerUrl: 'https://arbiscan.io' },
  { id: 'optimism', name: 'Optimism', icon: '/images/chains/optimism.png', chainId: 10, nativeCurrency: 'ETH', explorerUrl: 'https://optimistic.etherscan.io' },
  { id: 'fantom', name: 'Fantom', icon: '/images/chains/fantom.png', chainId: 250, nativeCurrency: 'FTM', explorerUrl: 'https://ftmscan.com' },
  { id: 'base', name: 'Base', icon: '/images/chains/base.png', chainId: 8453, nativeCurrency: 'ETH', explorerUrl: 'https://basescan.org' },
  { id: 'zksync', name: 'zkSync Era', icon: '/images/chains/zksync.png', chainId: 324, nativeCurrency: 'ETH', explorerUrl: 'https://explorer.zksync.io' },
  { id: 'metis', name: 'Metis', icon: '/images/chains/metis.png', chainId: 1088, nativeCurrency: 'METIS', explorerUrl: 'https://andromeda-explorer.metis.io' },
  { id: 'celo', name: 'Celo', icon: '/images/chains/celo.png', chainId: 42220, nativeCurrency: 'CELO', explorerUrl: 'https://celoscan.io' },
  { id: 'cronos', name: 'Cronos', icon: '/images/chains/cronos.png', chainId: 25, nativeCurrency: 'CRO', explorerUrl: 'https://cronoscan.com' },
  { id: 'gnosis', name: 'Gnosis', icon: '/images/chains/gnosis.png', chainId: 100, nativeCurrency: 'xDAI', explorerUrl: 'https://gnosisscan.io' },
  { id: 'kava', name: 'Kava', icon: '/images/chains/kava.png', chainId: 2222, nativeCurrency: 'KAVA', explorerUrl: 'https://explorer.kava.io' },
  { id: 'mantle', name: 'Mantle', icon: '/images/chains/mantle.png', chainId: 5000, nativeCurrency: 'MNT', explorerUrl: 'https://explorer.mantle.xyz' }
];

export const balanceOptions: BalanceOption[] = [
  {
    price: 5,
    isRecommended: true
  },
  {
    price: 20
  },
  {
    price: 50
  },
  {
    price: 200
  }
];

export const baseButtonStyle = `
  bg-[radial-gradient(70%_70%_at_center,rgba(8,10,12,0.98)_0%,rgba(160,165,180,0.25)_100%)]
  backdrop-blur-sm
  border border-[#888]/30
  transition-all duration-400 ease-in-out
  shadow-[0_0_10px_rgba(0,0,0,0.2),inset_0_0_20px_4px_rgba(0,0,0,0.3)]
  hover:border-[#aaa]/75
  hover:bg-[radial-gradient(70%_70%_at_center,rgba(8,10,12,0.98)_0%,rgba(160,165,180,0.5)_100%)]
  hover:shadow-[0_0_15px_rgba(0,0,0,0.3),inset_0_0_25px_6px_rgba(0,0,0,0.3)]
  active:shadow-[0_0_20px_rgba(0,0,0,0.4),inset_0_0_30px_8px_rgba(0,0,0,0.3)]
  disabled:!opacity-50 
  disabled:pointer-events-none 
  disabled:cursor-not-allowed
`;

export const baseContainerStyle = `
  bg-[radial-gradient(70%_70%_at_center,rgba(8,10,12,0.98)_0%,rgba(160,165,180,0.25)_100%)]
  backdrop-blur-sm
  border border-[#888]/30
  shadow-[0_0_10px_rgba(0,0,0,0.2),inset_0_0_20px_4px_rgba(0,0,0,0.3)]
`;

export const baseContainerStyleCss = {
  background: "radial-gradient(70% 70% at center, rgba(8,10,12,0.98) 0%, rgba(160,165,180,0.25) 100%)",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(136,136,136,0.3)",
  boxShadow: "0 0 10px rgba(0,0,0,0.2), inset 0 0 20px 4px rgba(0,0,0,0.3)",
  color: "#FCFCFC"
};
