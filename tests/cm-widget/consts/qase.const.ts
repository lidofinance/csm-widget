import { createQaseTree } from 'tests/shared/helpers/qaseTree';

export const EPIC = {
  landing: {
    name: 'Landing page',
    features: [],
  },
  navigation: {
    name: 'Navigation',
    features: [],
  },
  createOperator: {
    name: 'Create operator',
    features: ['New operator', 'Additional operator'],
  },
  bondRewards: {
    name: 'Bond & Rewards',
    features: ['Add bond', 'Claim'],
  },
  keys: {
    name: 'Keys',
    features: ['Submit keys', 'Remove keys', 'View keys'],
  },
  dashboard: {
    name: 'Dashboard',
    features: ['Keys', 'Bond & Rewards', 'Roles'],
  },
  group: {
    name: 'Group',
    features: [],
  },
  settings: {
    name: 'Settings',
    features: ['Metadata', 'Rewards claimer', 'Splits'],
  },
} as const;

export const qaseTree = createQaseTree<typeof EPIC>();
