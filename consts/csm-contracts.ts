import { CHAINS } from '@lido-sdk/constants';
import { Address } from 'wagmi';

type CSMContract =
  | 'CSAccounting'
  | 'CSFeeDistributor'
  | 'CSFeeOracle'
  | 'CSModule'
  | 'CSVerifier';

export type ChainAddressMap = Partial<
  Record<CHAINS, Record<CSMContract, Address>>
>;

export const CONTRACTS_BY_NETWORK: ChainAddressMap = {
  // @note local mainnetish
  [CHAINS.Mainnet]: {
    CSAccounting: '0xfb6dAB6200b8958C2655C3747708F82243d3F32E',
    CSFeeDistributor: '0xbc71F5687CFD36f64Ae6B4549186EE3A6eE259a4',
    CSFeeOracle: '0xabebE9a2D62Af9a89E86EB208b51321e748640C3',
    CSModule: '0x10537D7bD661C9c34F547b38EC662D6FD482Ae95',
    CSVerifier: '0xD73bAb8F06DB28c87932571f87D0D2C0FDF13D94',
  },
  // @note devnet.0
  [CHAINS.Holesky]: {
    CSAccounting: '0x9808a94167b30c2F71d2863dbdB8eD9B65ED1DBe',
    CSFeeDistributor: '0xFBb0158db5061343Cd130F04FDe71CA62DdBdE2D',
    CSFeeOracle: '0x0Ac2f7145200ce74eEb717C4e36076aC67f1D5E5',
    CSModule: '0xddB08564C699D5392a9E9a3C8E2Ab9D7C1949CB6',
    CSVerifier: '0x57A3807E89cfC10dA48e90D994b5dCa15d595ABb',
  },
};

export const getCSMContractAddress = (
  chainId: CHAINS,
  contract: CSMContract,
): Address => {
  const address = CONTRACTS_BY_NETWORK[chainId]?.[contract];
  if (address == null) {
    throw new Error(`Contract [${chainId}]:${contract} is not specified`);
  }

  return address;
};

export const getCSMContractAddressGetter =
  (contract: CSMContract) => (chainId: CHAINS) =>
    getCSMContractAddress(chainId, contract);
