export { withOperator } from './withOperator';
export { withGroup } from './withGroup';
export { withKeys } from './withKeys';

/**
 * Default execution order for state handlers.
 * States are always applied in this sequence regardless of the order in a preset.
 */
export const HANDLER_ORDER = ['withOperator', 'withGroup', 'withKeys'] as const;
