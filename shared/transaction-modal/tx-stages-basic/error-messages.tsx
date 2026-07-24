import { ReactNode } from 'react';
import { ErrorCode } from 'utils/get-error-code';

// Per-error-code presentation metadata for the failure modal.
//   - message:     copy shown when the resolver has no more specific text
//   - retryable:   whether the footer offers a retry/action button at all.
//                  false for deterministic failures where retrying repeats the
//                  failure (on-chain reverts, insufficient funds, exhausted
//                  limits).
//   - actionLabel: overrides the default "Retry" label (e.g. re-auth, switch).
export type ErrorMeta = {
  message: ReactNode;
  retryable: boolean;
  actionLabel?: string;
};

export const ERROR_META: Record<ErrorCode, ErrorMeta> = {
  [ErrorCode.DENIED_SIG]: {
    message: 'User denied the transaction signature',
    retryable: true,
  },
  [ErrorCode.NOT_ENOUGH_ETHER]: {
    message: 'Not enough ether for gas',
    retryable: false, // wallet must be funded first
  },
  [ErrorCode.WALLET_RPC]: {
    // Generalized: the WALLET_RPC bucket covers any wallet RPC fault. Genuine
    // rate-limiting is now RATE_LIMITED → TOO_MANY_REQUESTS, so this copy no
    // longer claims "Too many requests".
    message: (
      <>
        Your wallet&apos;s RPC provider returned an error. <br />
        Try changing the RPC URL in your wallet.
      </>
    ),
    retryable: true,
  },
  [ErrorCode.WALLET_TIMEOUT]: {
    message: 'Your wallet took too long to respond. Please try again.',
    retryable: true,
  },
  [ErrorCode.WALLET_UNAUTHORIZED]: {
    message:
      'Your wallet has not authorized this action. Reconnect your wallet and try again.',
    retryable: true,
  },
  [ErrorCode.WALLET_UNSUPPORTED]: {
    message: 'Your wallet does not support this operation',
    retryable: false, // wallet capability — retrying repeats the failure
  },
  [ErrorCode.NONCE_ERROR]: {
    message:
      "Your wallet's transaction nonce is out of sync. Reset the account activity in your wallet and try again.",
    retryable: true,
  },
  [ErrorCode.FEE_ERROR]: {
    message:
      'The transaction fee is set too high or too low. Adjust the fee in your wallet and try again.',
    retryable: true,
  },
  [ErrorCode.GAS_ERROR]: {
    message:
      'The transaction gas limit is invalid. Adjust the gas limit in your wallet and try again.',
    retryable: true,
  },
  [ErrorCode.SMART_ACCOUNT_ERROR]: {
    message:
      'Your smart account could not process this transaction. Please review the details.',
    retryable: false, // AA validation/paymaster revert — deterministic
  },
  [ErrorCode.BUNDLE_NOT_FOUND]: {
    message:
      'Could not locate the transaction. Please check your wallet for details.',
    retryable: false, // tx may already be submitted — avoid double-send
  },
  [ErrorCode.NETWORK_ERROR]: {
    message: 'Network request failed, please check your connection',
    retryable: true,
  },
  [ErrorCode.CHAIN_MISMATCH]: {
    message:
      'Your wallet is connected to the wrong network. Switch to the correct network and try again.',
    retryable: true,
    actionLabel: 'Switch network',
  },
  [ErrorCode.CONTRACT_ERROR]: {
    message: 'The transaction cannot be completed. Please review the details.',
    retryable: false, // deterministic revert — retrying repeats the failure
  },
  [ErrorCode.EXECUTION_REVERTED]: {
    message:
      'The transaction would fail and was not sent. Please review the details.',
    retryable: false, // simulation reverted — same call reverts again
  },
  [ErrorCode.TRANSACTION_REVERTED]: {
    message:
      'Transaction was included into block but reverted during execution',
    retryable: false, // mined and reverted — the same tx reverts again
  },
  [ErrorCode.DECODE_RESULT_ERROR]: {
    // Tx is confirmed on-chain — do not imply failure.
    message:
      'Your transaction was confirmed on-chain, but the app could not read the result. Refresh to see the latest state.',
    retryable: true,
    actionLabel: 'Refresh',
  },
  [ErrorCode.LIMIT_REACHED]: {
    message:
      'Transaction could not be completed because stake limit is exhausted. Please wait until the stake limit restores. Otherwise, you can swap your Ethereum on 1inch platform instantly.',
    retryable: false, // limit must restore first
  },
  [ErrorCode.INVALID_SIGNATURE]: {
    message:
      'Invalid Permit signature. Perhaps it has expired or already been used. Try submitting the request again.',
    retryable: true, // a fresh permit is signed on retry
  },
  [ErrorCode.BALANCE_EXCEEDED]: {
    message: 'Balance exceeded. Not enough tokens to perform TX.',
    retryable: false,
  },
  [ErrorCode.DEVICE_LOCKED]: {
    message: 'Please unlock your Ledger hardware wallet',
    retryable: true,
  },
  [ErrorCode.ENABLE_BLIND_SIGNING]: {
    message: 'Please enable blind signing on your Ledger hardware wallet',
    retryable: true,
  },
  [ErrorCode.SESSION_EXPIRED]: {
    message: 'Your session has expired. Please sign in again to continue.',
    retryable: true,
    actionLabel: 'Sign in again',
  },
  [ErrorCode.TOO_MANY_REQUESTS]: {
    message: 'Too many requests. Please wait a moment and try again.',
    retryable: true,
  },
  [ErrorCode.SERVER_ERROR]: {
    message: 'The server is temporarily unavailable. Please try again later.',
    retryable: true,
  },
  [ErrorCode.SOMETHING_WRONG]: {
    message: 'Something went wrong',
    retryable: true,
  },
};
