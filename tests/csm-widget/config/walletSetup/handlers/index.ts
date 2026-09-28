import { withOperator } from './withOperator';
import { withTokens } from './withTokens';
import { withDepositedKeys } from './withDepositedKeys';
import { withRemovableKeys } from './withRemovableKeys';

export const HANDLERS = {
  withTokens,
  withOperator,
  withDepositedKeys,
  withRemovableKeys,
};

export type HandlerName = keyof typeof HANDLERS;

export const HANDLER_ORDER = [
  'withTokens',
  'withOperator',
  'withDepositedKeys',
  'withRemovableKeys',
] as const satisfies readonly HandlerName[];
