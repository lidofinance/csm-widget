import { ONE_ETH } from 'consts';

export const convert = (value: bigint, rate: bigint, base = ONE_ETH) => {
  return (value * rate) / base;
};
