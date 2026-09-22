import { createSuite } from 'tests/shared/helpers/suite';

export const EPIC = {
  landing: {
    name: 'Landing page',
    features: [],
  },
  cache: {
    name: 'Cache',
    features: [],
  },
  keys: {
    name: 'Keys',
    features: ['Submit keys', 'Remove keys', 'View keys'],
  },
  bondRewards: {
    name: 'Bond & Rewards',
    features: ['Add bond', 'Claim'],
  },
  roles: {
    name: 'Roles',
    features: [
      'Manager address',
      'Rewards address',
      'Inbox requests',
      'Rewards claimer',
    ],
  },
  operatorType: {
    name: 'Operator type',
    features: ['ICS', 'IDVTC'],
  },
  dashboard: {
    name: 'Dashboard',
    /** sections of the page */
    features: ['Bond & Rewards'],
  },
  monitoring: {
    name: 'Monitoring',
    features: [],
  },
} as const;

export const suite = createSuite<typeof EPIC>();
