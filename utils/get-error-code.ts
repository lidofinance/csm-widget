import { trackMatomoError } from './track-matomo-event';

export enum ErrorCode {
  NOT_ENOUGH_ETHER = 'NOT_ENOUGH_ETHER',
  DENIED_SIG = 'DENIED_SIG',
  SOMETHING_WRONG = 'SOMETHING_WRONG',
  TRANSACTION_REVERTED = 'TRANSACTION_REVERTED',
  ENABLE_BLIND_SIGNING = 'ENABLE_BLIND_SIGNING',
  LIMIT_REACHED = 'LIMIT_REACHED',
  DEVICE_LOCKED = 'DEVICE_LOCKED',
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',
  BALANCE_EXCEEDED = 'BALANCE_EXCEEDED',
  WALLET_RPC = 'WALLET_RPC',
}

export const getErrorCode = (error: unknown): ErrorCode => {
  trackMatomoError(`${error}`, 'tx_error');

  try {
    console.error('TX_ERROR:', { error, error_string: JSON.stringify(error) });
  } catch (e) {
    console.error('TX_ERROR:', e);
  }

  const code = extractCodeFromError(error);
  switch (code) {
    case -32000: {
      // Handling user-canceled transaction from a safe-app
      if ((error as any)?.message === 'User rejected transaction') {
        return ErrorCode.DENIED_SIG;
      }
      return ErrorCode.SOMETHING_WRONG;
    }
    case -32603:
      return ErrorCode.WALLET_RPC;
    // intentional fallthrough
    case 3:
    case 'UNPREDICTABLE_GAS_LIMIT':
    case 'INSUFFICIENT_FUNDS':
      return ErrorCode.NOT_ENOUGH_ETHER;
    case 'INVALID_SIGNATURE':
      return ErrorCode.INVALID_SIGNATURE;
    case 'ACTION_REJECTED':
    case 4001:
    case 200001:
      return ErrorCode.DENIED_SIG;
    case 'LIMIT_REACHED':
      return ErrorCode.LIMIT_REACHED;
    case 'TRANSACTION_REVERTED':
      return ErrorCode.TRANSACTION_REVERTED;
    case 'ENABLE_BLIND_SIGNING':
      return ErrorCode.ENABLE_BLIND_SIGNING;
    case 'DEVICE_LOCKED':
      return ErrorCode.DEVICE_LOCKED;
    case 'BALANCE_EXCEEDED':
      return ErrorCode.BALANCE_EXCEEDED;
    default:
      return ErrorCode.SOMETHING_WRONG;
  }
};

// type safe error code extractor
export const extractCodeFromError = (
  error: unknown,
  shouldDig = true,
): number | string => {
  // early exit on non object error
  if (!error || typeof error != 'object') return 0;

  if (
    'code' in error &&
    error.code === 'CALL_EXCEPTION' &&
    'receipt' in error
  ) {
    const receipt = error.receipt as { blockHash?: string };
    if (receipt.blockHash?.startsWith('0x')) return 'TRANSACTION_REVERTED';
  }

  if ('reason' in error && typeof error.reason == 'string') {
    if (error.reason.includes('STAKE_LIMIT')) return 'LIMIT_REACHED';
    if (error.reason.includes('INVALID_SIGNATURE')) return 'INVALID_SIGNATURE';
    if (error.reason.includes('BALANCE_EXCEEDED')) return 'BALANCE_EXCEEDED';
  }

  // sometimes we have error message but bad error code
  if ('message' in error && typeof error.message == 'string') {
    const normalizedMessage = error.message.toLowerCase();
    if (
      normalizedMessage.includes('denied message signature') ||
      normalizedMessage.includes('transaction was rejected') ||
      normalizedMessage.includes('rejected the transaction') ||
      normalizedMessage.includes('rejected the request') ||
      normalizedMessage.includes('reject this request') ||
      normalizedMessage.includes('rejected methods') ||
      normalizedMessage.includes('transaction declined')
    )
      return 'ACTION_REJECTED';
  }

  // SDK errors use errorMessage instead of message
  if ('errorMessage' in error && typeof error.errorMessage === 'string') {
    if (error.errorMessage.includes('BALANCE_EXCEEDED'))
      return 'BALANCE_EXCEEDED';
    if (error.errorMessage.includes('STAKE_LIMIT')) return 'LIMIT_REACHED';
    if (error.errorMessage.includes('INVALID_SIGNATURE'))
      return 'INVALID_SIGNATURE';
  }

  // Ledger live errors
  if (
    'data' in error &&
    typeof error.data === 'object' &&
    Array.isArray(error.data) &&
    typeof error.data['0'] === 'object' &&
    typeof error.data['0'].message === 'string' &&
    error.data['0'].message.toLowerCase().includes('rejected')
  ) {
    return 'ACTION_REJECTED';
  }

  if ('name' in error && typeof error.name == 'string') {
    const error_name = error.name.toLowerCase();
    if (error_name === 'EthAppPleaseEnableContractData'.toLowerCase())
      return 'ENABLE_BLIND_SIGNING';
    if (error_name === 'LockedDeviceError'.toLowerCase()) {
      return 'DEVICE_LOCKED';
    }
  }
  if ('code' in error) {
    if (typeof error.code === 'string') return error.code.toUpperCase();
    if (typeof error.code == 'number') return error.code;
  }

  // errors are sometimes nested :(
  if ('error' in error && shouldDig && error.error) {
    return extractCodeFromError(error.error, false);
  }

  return 0;
};
