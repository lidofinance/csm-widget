import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { defineWalletSetup } from 'tests/shared/config/walletSetup';
import { HANDLERS, HANDLER_ORDER } from './handlers';

export const walletSetup = defineWalletSetup({
  module: MODULE_NAME.CSM,
  handlers: HANDLERS,
  order: HANDLER_ORDER,
  definitions: {
    EMPTY_ADDRESS: {
      state: [],
    },

    EMPTY_OPERATOR: {
      state: ['withOperator', 'withDepositedKeys'],
    },

    FULL_OPERATOR: {
      state: ['withOperator', 'withDepositedKeys', 'withRemovableKeys'],
    },
  },
});

export const PRESETS = walletSetup.presets;
export type PresetName = keyof typeof walletSetup.definitions;
