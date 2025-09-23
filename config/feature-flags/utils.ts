import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import {
  FeatureFlagsType,
  ICS_APPLY_FORM,
  RPC_SETTINGS_PAGE_ON_INFRA_IS_ENABLED,
} from './types';
import { getConfig } from 'config/get-config';

const { defaultChain } = getConfig();
const isMainnet = defaultChain === CHAINS.Mainnet;

export const getFeatureFlagsDefault = (): FeatureFlagsType => {
  return {
    [RPC_SETTINGS_PAGE_ON_INFRA_IS_ENABLED]: false,
    [ICS_APPLY_FORM]: !!isMainnet,
  };
};
