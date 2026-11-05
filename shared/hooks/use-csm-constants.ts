import { getExternalLinks } from 'consts';
import { useDappStatus } from 'modules/web3';
import { useRenderedModule } from './use-module-meta';

export const useExternalLinks = () => {
  const { chainId } = useDappStatus();
  return getExternalLinks(chainId, useRenderedModule());
};
