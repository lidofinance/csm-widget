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

  ONLY_OPERATOR: {
    state: ['withOperator'],
    gates: ['po'],
  },

  FULL_OPERATOR: {
    state: ['withOperator', 'withGroup', 'withKeys'],
    gates: ['po'],
  },
} satisfies Record<string, PresetDefinition>;
