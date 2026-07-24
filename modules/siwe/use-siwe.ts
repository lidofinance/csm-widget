import { addDays } from 'date-fns';
import { useDappStatus } from 'modules/web3';
import { useCallback } from 'react';
import { SiweMessage } from 'siwe';
import invariant from 'tiny-invariant';
import { useSignMessage } from 'wagmi';
import type { SiweOptions } from './types';

const createSiweMessage = (
  address: string,
  statement: string,
  nonce: string,
  chainId?: number,
) => {
  const scheme = window.location.protocol.slice(0, -1);
  const domain = window.location.host;
  const uri = window.location.origin;

  const message = new SiweMessage({
    scheme,
    domain,
    address,
    statement,
    uri,
    version: '1',
    chainId,
    nonce,
    expirationTime: addDays(new Date(), 1).toISOString(),
  });
  return message.prepareMessage();
};

export const useSiwe = ({ statement }: SiweOptions) => {
  const { address, chainId } = useDappStatus();
  const { mutateAsync: signMessageAsync } = useSignMessage();

  return useCallback(
    async (nonce: string) => {
      invariant(address, 'Signer is not available');

      const message = createSiweMessage(address, statement, nonce, chainId);
      const signature = await signMessageAsync({
        message,
      });
      return { signature, message };
    },
    [address, chainId, signMessageAsync, statement],
  );
};
