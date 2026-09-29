import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { defineWalletSetup } from 'tests/shared/config/walletSetup';
import type { ChainName } from 'tests/shared/contracts/constants';
import { widgetFullConfig } from '../';
import { HANDLERS, HANDLER_ORDER } from './handlers';

export const walletSetup = defineWalletSetup({
  chain: widgetFullConfig.standConfig.keysGeneratorConfig.chain as ChainName,
  module: MODULE_NAME.CSM,
  handlers: HANDLERS,
  order: HANDLER_ORDER,
  definitions: {
    EMPTY_ADDRESS: {
      state: [],
    },

    EMPTY_OPERATOR: {
      state: ['withOperator', 'withoutKeys'],
    },

    FULL_OPERATOR: {
      state: [
        'withTokens',
        'withOperator',
        'withDepositedKeys',
        'withRemovableKeys',
      ],
    },
  },
});

export const PRESETS = walletSetup.presets;
export type PresetName = keyof typeof walletSetup.definitions;
