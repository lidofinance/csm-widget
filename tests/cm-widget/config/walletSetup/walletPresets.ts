import { type WalletStateService } from './walletStates';
import { type GateSelector } from './handlers/types';

export type PresetName = keyof typeof WALLET_PRESET_DEFINITIONS;

export type PresetDefinition = {
  state: (keyof WalletStateService['handlers'])[];
  gates?: GateSelector[];
};

export const WALLET_PRESET_DEFINITIONS = {
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
} satisfies Record<string, PresetDefinition>;
