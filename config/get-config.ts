import { getPreConfig, PreConfigType } from './get-preconfig';
import * as cache from './groups/cache';
import * as ipfs from './groups/ipfs';
import * as locale from './groups/locale';
import * as stake from './groups/stake';
import * as web3 from './groups/web3';
import * as revalidation from './groups/revalidation';

export type ConfigType = {
  isClientSide: boolean;
  isServerSide: boolean;
} & typeof cache &
  typeof ipfs &
  typeof locale &
  typeof stake &
  typeof web3 &
  typeof revalidation &
  PreConfigType;

export const getConfig = (): ConfigType => {
  return {
    isClientSide: typeof window !== 'undefined',
    isServerSide: typeof window === 'undefined',

    ...cache,
    ...ipfs,
    ...locale,
    ...stake,
    ...web3,
    ...revalidation,

    // highest priority
    ...getPreConfig(),
  };
};

export const config = getConfig();
