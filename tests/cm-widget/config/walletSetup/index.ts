import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { defineWalletSetup } from 'tests/shared/config/walletSetup';
import { HANDLERS, HANDLER_ORDER } from './handlers';

export const walletSetup = defineWalletSetup({
  module: MODULE_NAME.CM,
  handlers: HANDLERS,
  order: HANDLER_ORDER,
  definitions: {
    EMPTY_OPERATOR: {
      state: [],
    },

    EMPTY_OPERATOR_WITH_ALL_GATES: {
      state: [],
      gates: ['po', 'pto', 'pgo', 'do', 'eeo', 'iodc', 'iodcp'],
    },

    ONLY_OPERATOR: {
      state: ['withOperator'],
      gates: ['po', 'pto'],
    },

    FULL_OPERATOR: {
      state: ['withOperator', 'withGroup', 'withKeys', 'withDeposit'],
      gates: ['po', 'pto'],
    },
  },
});

export const PRESETS = walletSetup.presets;
export type PresetName = keyof typeof walletSetup.definitions;
