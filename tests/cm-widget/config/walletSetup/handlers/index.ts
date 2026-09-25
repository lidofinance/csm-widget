import { withOperator } from './withOperator';
import { withGroup } from './withGroup';
import { withKeys } from './withKeys';
import { withDeposit } from './withDeposit';

export const HANDLERS = { withOperator, withGroup, withKeys, withDeposit };

export type HandlerName = keyof typeof HANDLERS;

/**
 * Default execution order for state handlers.
 * States are always applied in this sequence regardless of the order in a preset.
 */
export const HANDLER_ORDER = [
  'withOperator',
  'withGroup',
  'withKeys',
  'withDeposit',
] as const satisfies readonly HandlerName[];
