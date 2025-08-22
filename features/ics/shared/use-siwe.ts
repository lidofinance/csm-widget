import { addDays } from 'date-fns';
import { useAccount } from 'shared/hooks';
import { useCallback } from 'react';
import { SiweMessage } from 'siwe';
import invariant from 'tiny-invariant';
import { useSignMessage } from 'wagmi';

const createSiweMessage = (address: string, chainId?: number) => {
  const statement = 'Sign in to use the ICS Apply form';
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
    expirationTime: addDays(new Date(), 1).toISOString(),
  });
  return message.prepareMessage();
};

export const useSiwe = () => {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();

  return useCallback(async () => {
    invariant(address, 'Signer is not available');

    const message = createSiweMessage(address, chainId);
    const signature = await signMessageAsync({
      message,
    });
    return { signature, message };
  }, [address, chainId, signMessageAsync]);
};
