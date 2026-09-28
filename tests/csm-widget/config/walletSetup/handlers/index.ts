import { withOperator } from './withOperator';
import { withTokens } from './withTokens';
import { withoutKeys } from './withoutKeys';
import { withDepositedKeys } from './withDepositedKeys';
import { withRemovableKeys } from './withRemovableKeys';

export const HANDLERS = {
  withTokens,
  withOperator,
  withoutKeys,
  withDepositedKeys,
  withRemovableKeys,
};

export type HandlerName = keyof typeof HANDLERS;

export const HANDLER_ORDER = [
  'withTokens',
  'withOperator',
  'withoutKeys',
  'withDepositedKeys',
  'withRemovableKeys',
] as const satisfies readonly HandlerName[];
