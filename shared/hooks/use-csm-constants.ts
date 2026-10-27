import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { getExternalLinks } from 'consts';
import { useDappStatus, useTargetModule } from 'modules/web3';

export const useExternalLinks = (module?: MODULE_NAME) => {
  const { chainId } = useDappStatus();
  const target = useTargetModule();
  const resolved = module ?? target ?? MODULE_NAME.CSM;
  const links = getExternalLinks(chainId);
  return {
    ...links,
    feedbackForm: links.feedbackForm[resolved],
    landing: links.landing[resolved],
  };
};
