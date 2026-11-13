// Don't use absolute import here!
// code'''
//    import { config } from 'config';
// '''
// otherwise you will get something like a cyclic error!
import { config } from '../get-config';
import { UserConfigDefaultType } from './types';

export const getUserConfigDefault = (): UserConfigDefaultType => {
  return {
    defaultChain: config.defaultChain,
    walletconnectProjectId: config.walletconnectProjectId,
    defaultIpfsGateways: config.ipfsGateways,
  };
};
