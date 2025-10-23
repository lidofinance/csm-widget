import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { getConfig } from 'config/get-config';
import {
  FeatureFlagsType,
  ICS_APPLY_FORM,
  SURVEYS_SETUP_ENABLED,
} from './types';

const { defaultChain } = getConfig();
const isMainnet = defaultChain === CHAINS.Mainnet;

export const getFeatureFlagsDefault = (): FeatureFlagsType => {
  return {
    [ICS_APPLY_FORM]: isMainnet,
    [SURVEYS_SETUP_ENABLED]: isMainnet,
  };
};
