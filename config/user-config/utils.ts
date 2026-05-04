// Don't use absolute import here!
// code'''
//    import { config } from 'config';
// '''
// otherwise you will get something like a cyclic error!
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { config } from '../get-config';
import { UserConfigDefaultType } from './types';

export const getUserConfigDefault = (): UserConfigDefaultType => {
  return {
    defaultChain: config.defaultChain,
    prefillUnsafeElRpcUrls: {
      [CHAINS.Mainnet]: config.prefillUnsafeElRpcUrls1,
      [CHAINS.Hoodi]: config.prefillUnsafeElRpcUrls560048,
    },
    walletconnectProjectId: config.walletconnectProjectId,
  };
};
