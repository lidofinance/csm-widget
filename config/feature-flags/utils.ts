import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { getConfig } from 'config/get-config';
import {
  FeatureFlagsType,
  ICS_APPLY_FORM,
  SURVEYS_SETUP_ENABLED,
  USE_WALLET_RPC,
  DISABLE_DEPOSIT_DATA_VALIDATION,
} from './types';

const { defaultChain } = getConfig();
const isMainnet = defaultChain === CHAINS.Mainnet;

export const getFeatureFlagsDefault = (): FeatureFlagsType => {
  return {
    [USE_WALLET_RPC]: false,
    [ICS_APPLY_FORM]: isMainnet,
    [SURVEYS_SETUP_ENABLED]: isMainnet,
    [DISABLE_DEPOSIT_DATA_VALIDATION]: false,
  };
};
