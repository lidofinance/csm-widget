import { withOperator } from './withOperator';
import { withDepositedKeys } from './withDepositedKeys';
import { withRemovableKeys } from './withRemovableKeys';

export const HANDLERS = {
  withOperator,
  withDepositedKeys,
  withRemovableKeys,
};

export type HandlerName = keyof typeof HANDLERS;

export const HANDLER_ORDER = [
  'withOperator',
  'withDepositedKeys',
  'withRemovableKeys',
] as const satisfies readonly HandlerName[];
