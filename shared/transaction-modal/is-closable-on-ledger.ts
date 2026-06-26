import { isValidElement, type ReactNode } from 'react';

/**
 * Marker for terminal stage components (success / fail) that may be dismissed
 * even on Ledger, where the transaction modal is otherwise locked while a
 * signature is pending. Attach it to the stage component itself
 * (`MyStage.isClosableOnLedger = true`) so closability is derived from what is
 * rendered instead of being repeated at every call site.
 */
export type ClosableOnLedgerStage = { isClosableOnLedger?: boolean };

export const isClosableOnLedgerStage = (node: ReactNode): boolean => {
  if (!isValidElement(node)) return false;
  const { type } = node;
  return (
    typeof type !== 'string' &&
    (type as ClosableOnLedgerStage).isClosableOnLedger === true
  );
};
