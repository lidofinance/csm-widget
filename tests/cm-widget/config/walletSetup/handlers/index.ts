export { withOperator } from './withOperator';
export { withSecondOperator } from './withSecondOperator';
export { withGroup } from './withGroup';
export { withKeys } from './withKeys';
export { withDeposit } from './withDeposit';

/**
 * Default execution order for state handlers.
 * States are always applied in this sequence regardless of the order in a preset.
 */
export const HANDLER_ORDER = [
  'withOperator',
  'withSecondOperator',
  'withGroup',
  'withKeys',
  'withDeposit',
] as const;
