import { parseEther } from 'viem';

// one eth
export const ONE_ETH = parseEther('1');

// max 1000 eth to claim (unstETH);
export const MAX_ETH_AMOUNT = parseEther('1000');

// min 100 wei to claim (unstETH);
export const MIN_ETH_AMOUNT = 100n;

export const HIGH_EJECTION_COST_THRESHOLD = parseEther('0.01');
