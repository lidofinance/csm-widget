export class MultisigBreakError extends Error {
  isMultisigBreak = true;
}

export const handleTxError = (error: unknown) => {
  // TODO: force retry for multisig break?
  return error instanceof MultisigBreakError;
};
