export const extractErrorMessage = (error: unknown): string | undefined => {
  if (!error) return undefined;
  if (typeof error === 'string') return error;

  if (typeof error === 'object') {
    // Standard error.message
    if ('message' in error && typeof error.message === 'string') {
      const msg = error.message;
      // Extract reason from "Execution reverted with reason: BALANCE_EXCEEDED"
      const match = msg.match(/Execution reverted with reason: (.+)/);
      if (match) return match[1];
      // Return if short and readable
      if (msg.length < 150 && !msg.includes('0x')) return msg;
    }

    // Contract revert reason
    if ('reason' in error && typeof error.reason === 'string') {
      return error.reason;
    }

    // Nested error
    if ('error' in error && error.error) {
      return extractErrorMessage(error.error);
    }
  }

  return undefined;
};
