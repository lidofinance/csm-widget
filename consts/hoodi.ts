import { Chain } from 'wagmi';

export const hoodi: Readonly<Chain> = {
  id: 560048,
  network: 'hoodi',
  name: 'Hoodi',
  nativeCurrency: {
    name: 'Hoodie Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.hoodi.ethpandaops.io'],
    },
    public: {
      http: ['https://rpc.hoodi.ethpandaops.io'],
    },
  },
  contracts: {},
  testnet: true,
};
