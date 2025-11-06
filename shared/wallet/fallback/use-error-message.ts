import { useDappStatus } from 'modules/web3';
import { useConnectorInfo } from 'reef-knot/core-react';
import { helpers } from 'reef-knot/web3-react';
import { useChainName } from 'shared/hooks';
import { useConnect } from 'wagmi';

export const useErrorMessage = (): string | undefined => {
  const { isLedger } = useConnectorInfo();
  const { error } = useConnect();
  const { isSupportedChain } = useDappStatus();
  const chainName = useChainName(true);

  // Errors from chain state

  if (!isSupportedChain) {
    return `Unsupported chain. Please switch to ${chainName} in your wallet.`;
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
