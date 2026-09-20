import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useTargetModule } from 'modules/web3';
import { FAQ_BY_MODULE, FaqSection } from './index';

export const useFaq = (section: FaqSection, module?: MODULE_NAME) => {
  const target = useTargetModule();
  return FAQ_BY_MODULE[module ?? target ?? MODULE_NAME.CSM][section];
};
