export class MultisigBreakError extends Error {
  isMultisigBreak = true;
}

export const MULTISIG_BREAK = new MultisigBreakError();

export const handleTxError = (
  error: unknown,
  txModalStages: {
    successMultisig: () => void;
    failed: (error: unknown, onRetry?: () => void) => void;
  },
  onRetry?: () => void,
) => {
  if (error instanceof MultisigBreakError) {
    txModalStages.successMultisig();
    return true;
  }

  console.warn(error);
  txModalStages.failed(error, onRetry);
  return false;
};
