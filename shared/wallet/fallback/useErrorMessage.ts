import { useDappStatus } from 'modules/web3';
import { useConnectorInfo } from 'reef-knot/core-react';
import { helpers } from 'reef-knot/web3-react';
import { useConnect } from 'wagmi';

export const useErrorMessage = (): string | undefined => {
  const { isLedger } = useConnectorInfo();
  const { error } = useConnect();
  const { isSupportedChain } = useDappStatus();

  // Errors from chain state

  if (!isSupportedChain) {
    // TODO: replace {correct network} with the correct network name
    return `Unsupported chain. Please switch to {correct network} in your wallet.`;
  }

  // errors from connection state

  if (!error) {
    return;
  }

  if (isLedger) {
    return helpers.interceptLedgerError(error).message;
  }

  return error?.message;
};
