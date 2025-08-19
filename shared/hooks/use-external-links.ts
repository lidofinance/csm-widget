import { getExternalLinks } from 'consts';
import { useDappStatus } from 'modules/web3';

export const useExternalLinks = () => {
  const { chainId } = useDappStatus();
  return getExternalLinks(chainId);
};
