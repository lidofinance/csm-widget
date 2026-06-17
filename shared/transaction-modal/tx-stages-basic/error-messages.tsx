import { ReactNode } from 'react';
import { ErrorCode } from 'utils';

export const ErrorMessages: Record<ErrorCode, ReactNode> = {
  [ErrorCode.NOT_ENOUGH_ETHER]: 'Not enough ether for gas',
  [ErrorCode.DENIED_SIG]: 'User denied the transaction signature',
  [ErrorCode.SOMETHING_WRONG]: 'Something went wrong',
  [ErrorCode.TRANSACTION_REVERTED]:
    'Transaction was included into block but reverted during execution',
  [ErrorCode.ENABLE_BLIND_SIGNING]:
    'Please enable blind signing on your Ledger hardware wallet',
  [ErrorCode.LIMIT_REACHED]:
    'Transaction could not be completed because stake limit is exhausted. Please wait until the stake limit restores and try again. Otherwise, you can swap your Ethereum on 1inch platform instantly.',
  [ErrorCode.DEVICE_LOCKED]: 'Please unlock your Ledger hardware wallet',
  [ErrorCode.INVALID_SIGNATURE]:
    'Invalid Permit signature. Perhaps it has expired or already been used. Try submitting the request again.',
  [ErrorCode.BALANCE_EXCEEDED]:
    'Balance exceeded. Not enough tokens to perform TX.',
  [ErrorCode.WALLET_RPC]: (
    <>
      Wallet RPC provider returns &quot;Too many requests&quot;. <br />
      Try to change RPC url in your wallet.
    </>
  ),
  [ErrorCode.BUNDLE_NOT_FOUND]:
    'Could not locate the transaction. Please check your wallet for details.',
  [ErrorCode.NETWORK_ERROR]:
    'Network request failed, please check your connection',
  [ErrorCode.CHAIN_MISMATCH]:
    'Your wallet is connected to the wrong network. Switch to the correct network and try again.',
  [ErrorCode.CONTRACT_ERROR]:
    'The transaction cannot be completed. Please review the details and try again.',
  [ErrorCode.EXECUTION_REVERTED]:
    'The transaction would fail and was not sent. Please review the details and try again.',
  [ErrorCode.DECODE_RESULT_ERROR]:
    'Your transaction was confirmed on-chain, but the app could not read the result. Refresh to see the latest state.',
  [ErrorCode.SESSION_EXPIRED]:
    'Your session has expired. Please sign in again to continue.',
  [ErrorCode.TOO_MANY_REQUESTS]:
    'Too many requests. Please wait a moment and try again.',
  [ErrorCode.SERVER_ERROR]:
    'The server is temporarily unavailable. Please try again later.',
};
