import { getPreConfig, PreConfigType } from './get-preconfig';
import * as cache from './groups/cache';
import * as locale from './groups/locale';
import * as stake from './groups/stake';
import * as web3 from './groups/web3';

export type ConfigType = typeof cache &
  typeof locale &
  typeof stake &
  typeof web3 &
  PreConfigType;

export const getConfig = (): ConfigType => {
  return {
    ...cache,
    ...locale,
    ...stake,
    ...web3,

    // highest priority
    ...getPreConfig(),
  };
};

export const config = getConfig();
