import { CsmContract, getCsmConstants, getExternalLinks } from 'consts';
import { useAccount } from './use-account';

export const useCsmConstants = () => {
  const { chainId } = useAccount();
  return getCsmConstants(chainId);
};

export const useCsmAddress = (contractName: CsmContract) =>
  useCsmConstants().contracts[contractName];

export const useExternalLinks = () => {
  const { chainId } = useAccount();
  return getExternalLinks(chainId);
};
