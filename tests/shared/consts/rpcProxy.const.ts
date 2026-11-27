import {
  COMMON_ADDRESSES,
  CONTRACT_NAMES,
  SUPPORTED_CHAINS,
} from '@lidofinance/lido-csm-sdk';
import {
  rpcCall,
  slotOverride,
  SYMBOL_SELECTOR,
} from 'tests/shared/helpers/rpcRequest';

export const FOREIGN_ADDRESS = '0x000000000000000000000000000000000000dEaD';
export const MAX_GET_LOGS_RANGE = 1_000_000;
export const MAX_BATCH = 20;

// Holds the code a proxy runs: overriding it swaps the contract
const PROXY_IMPLEMENTATION_SLOT =
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';
const INVALID_CALL = 'RPC method eth_call is invalid';
const INVALID_REQUEST = 'Invalid Request';

/** The only contracts whose storage eth_call may override */
export const getTokens = (chainId: number) => {
  const common = COMMON_ADDRESSES[chainId as SUPPORTED_CHAINS];
  return {
    stETH: common[CONTRACT_NAMES.stETH] as string,
    wstETH: common[CONTRACT_NAMES.wstETH] as string,
  };
};

export const getRefusedOverrides = (token: string) => [
  {
    name: 'Code override',
    override: { [token]: { code: '0x00' } },
    error: INVALID_CALL,
  },
  {
    name: 'Override of a foreign address',
    override: slotOverride(FOREIGN_ADDRESS),
    error: 'State override address is not allowed for eth_call',
  },
  {
    name: 'Proxy implementation slot override',
    override: slotOverride(token, PROXY_IMPLEMENTATION_SLOT),
    error: INVALID_CALL,
  },
];

export const getMalformedRequests = (token: string) => [
  {
    name: 'Unknown call field "To"',
    data: rpcCall('eth_call', [
      { to: token, To: FOREIGN_ADDRESS, data: SYMBOL_SELECTOR },
      'latest',
    ]),
    error: INVALID_CALL,
  },
  {
    name: 'Object id',
    data: { ...rpcCall('eth_chainId'), id: {} },
    error: INVALID_REQUEST,
  },
  {
    name: 'Object params',
    data: { ...rpcCall('eth_chainId'), params: {} },
    error: INVALID_REQUEST,
  },
];
