import type { Addresses, GateSelector } from './constants.ts';
import { COMMANDS } from './forkActions.service.ts';

// Shared by `yarn fork` and `yarn qa-panel`: one description of every command

export type Command = (typeof COMMANDS)[number];

// ICS and IDVTC vet operators for a bond curve; the other gates create curated ones
const VETTED_GATES: GateSelector[] = ['ics', 'idvtc'];
const gateNames = (addresses: Addresses) =>
  Object.keys(addresses.gates) as GateSelector[];

/** Contracts a command needs: a module without them cannot run it */
export const NEEDS = {
  permissionlessGate: (addresses: Addresses) => !!addresses.permissionlessGate,
  curatedGates: (addresses: Addresses) =>
    gateNames(addresses).some((gate) => !VETTED_GATES.includes(gate)),
  vettedGates: (addresses: Addresses) =>
    gateNames(addresses).some((gate) => VETTED_GATES.includes(gate)),
  gates: (addresses: Addresses) => gateNames(addresses).length > 0,
  metaRegistry: (addresses: Addresses) => !!addresses.metaRegistry,
} satisfies Record<string, (addresses: Addresses) => boolean>;

export const HELP: Record<
  Command,
  { about: string; args: string; example: string; needs?: keyof typeof NEEDS }
> = {
  snapshot: {
    about: 'Save the fork state to roll back to later',
    args: '',
    example: 'yarn fork csm hoodi snapshot',
  },
  revert: {
    about: 'Roll the fork back to a snapshot, the latest by default',
    args: '[snapshotId]',
    example: 'yarn fork csm hoodi revert 0x2',
  },
  addBond: {
    about: 'Top up the operator bond with ETH',
    args: '<noId> <amountEth>',
    example: 'yarn fork csm hoodi addBond 12 3',
  },
  addKeys: {
    about: 'Add random keys to the operator, paying the bond they need',
    args: '<noId> <keysCount>',
    example: 'yarn fork csm hoodi addKeys 12 5',
  },
  depositKeys: {
    about: 'Deposit keys from the module queue, as the staking router does',
    args: '<depositsCount>',
    example: 'yarn fork csm hoodi depositKeys 10',
  },
  fundTokens: {
    about: 'Give the address stETH and wstETH',
    args: '<address> <amountEth>',
    example: 'yarn fork csm hoodi fundTokens 0xAbC... 10',
  },
  grantRole: {
    about: 'Grant a contract role to the address',
    args: '<role> <address>',
    example:
      'yarn fork csm hoodi grantRole REPORT_GENERAL_DELAYED_PENALTY_ROLE 0x1111111111111111111111111111111111111111',
  },
  removeKeys: {
    about: 'Remove keys of the operator that are not deposited yet',
    args: '<noId> [startIndex] [keysCount]',
    example: 'yarn fork csm hoodi removeKeys 12',
  },
  proposeManager: {
    about: 'Propose a new manager address for the operator',
    args: '<noId> <address>',
    example:
      'yarn fork csm hoodi proposeManager 12 0x1111111111111111111111111111111111111111',
  },
  confirmManager: {
    about: 'Accept the proposed manager address on its behalf',
    args: '<noId>',
    example: 'yarn fork csm hoodi confirmManager 12',
  },
  proposeReward: {
    about: 'Propose a new reward address for the operator',
    args: '<noId> <address>',
    example:
      'yarn fork csm hoodi proposeReward 12 0x1111111111111111111111111111111111111111',
  },
  confirmReward: {
    about: 'Accept the proposed reward address on its behalf',
    args: '<noId>',
    example: 'yarn fork csm hoodi confirmReward 12',
  },
  reportPenalty: {
    about: 'Report a general delayed penalty that locks part of the bond',
    args: '<noId> <amountEth>',
    example: 'yarn fork csm hoodi reportPenalty 12 1',
  },
  settlePenalty: {
    about: 'Settle the penalty reported for the operator',
    args: '<noId>',
    example: 'yarn fork csm hoodi settlePenalty 12',
  },
  reportRewards: {
    about: 'Distribute rewards to active keys with a new oracle report',
    args: '',
    example: 'yarn fork csm hoodi reportRewards',
  },
  setGateAddrs: {
    needs: 'gates',
    about: 'Put addresses into a gate tree so they can join through that gate',
    args: '<selector|[selectors]> <address...>',
    example:
      'yarn fork csm hoodi setGateAddrs ics 0x1111111111111111111111111111111111111111',
  },
  setRewardsClaimer: {
    about: 'Let another address claim the operator rewards',
    args: '<noId> <address>',
    example:
      'yarn fork csm hoodi setRewardsClaimer 12 0x1111111111111111111111111111111111111111',
  },
  setShareLimit: {
    about: 'Push the module share limit to reached, exhausted or approaching',
    args: '<REACHED|EXHAUSTED|APPROACHING>',
    example: 'yarn fork csm hoodi setShareLimit REACHED',
  },
  createCuratedOperator: {
    needs: 'curatedGates',
    about: 'Create a curated operator through a gate',
    args: '<selector> <address>',
    example:
      'yarn fork cm hoodi createCuratedOperator po 0x1111111111111111111111111111111111111111',
  },
  createPermissionlessOperator: {
    needs: 'permissionlessGate',
    about: 'Create a permissionless operator, optionally with keys',
    args: '<address> [keysCount]',
    example:
      'yarn fork csm hoodi createPermissionlessOperator 0x1111111111111111111111111111111111111111 3',
  },
  claimGateCurve: {
    needs: 'vettedGates',
    about: 'Claim the ICS or IDVTC bond curve for the operator',
    args: '<ics|idvtc> <noId> <member> [[treeAddresses]]',
    example:
      'yarn fork csm hoodi claimGateCurve ics 12 0x1111111111111111111111111111111111111111',
  },
  createOperatorGroup: {
    needs: 'metaRegistry',
    about: 'Create an operator group from operators and their weights',
    args: '<[{ id, weight }]>',
    example: `yarn fork cm hoodi createOperatorGroup '[{"id":12,"weight":50},{"id":1,"weight":50}]'`,
  },
};

export const CATEGORIES: Record<string, Command[]> = {
  'Fork state': ['snapshot', 'revert'],
  'Wallet & access': ['fundTokens', 'grantRole'],
  Operators: [
    'createPermissionlessOperator',
    'createCuratedOperator',
    'createOperatorGroup',
    'proposeManager',
    'confirmManager',
    'proposeReward',
    'confirmReward',
    'setRewardsClaimer',
    'claimGateCurve',
  ],
  Keys: ['addKeys', 'removeKeys', 'depositKeys'],
  'Bond & rewards': ['addBond', 'reportRewards'],
  Penalties: ['reportPenalty', 'settlePenalty'],
  Module: ['setGateAddrs', 'setShareLimit'],
};

const categorized = new Set(Object.values(CATEGORIES).flat());
const uncategorized = COMMANDS.filter((name) => !categorized.has(name));
if (uncategorized.length > 0) CATEGORIES.Other = uncategorized;
