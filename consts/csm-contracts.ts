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
    CSAccounting: '0x725314746e727f586E9FCA65AeD5dBe45aA71B99',
    CSFeeDistributor: '0x716473Fb4E7cD49c7d1eC7ec6d7490A03d9dA332',
    CSFeeOracle: '0x6B9C4119796C80Ced5a3884027985Fd31830555b',
    CSModule: '0x3A906C603F080D96dc08f81CF2889dAB6FF299dE',
    CSVerifier: '0x64079a2Edd1104a2323E2b732A1244BCE011B1F5',
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
