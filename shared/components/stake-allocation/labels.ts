export const STAKE_LABELS = {
  active: 'Active, ETH',
  depositable: 'Depositable, ETH',
  tsa: 'TSA, ETH',
} as const;

export const STAKE_TOOLTIPS = {
  active:
    'The amount of ETH currently staked by the Lido protocol with this Node Operator',
  depositable:
    'Available capacity ready to receive stake from the Lido protocol',
  tsa: 'Target Stake Allocation',
} as const;
