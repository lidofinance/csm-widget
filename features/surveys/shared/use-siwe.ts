import { useSDK } from '@lido-sdk/react';
import { addHours } from 'date-fns';
import { useCallback } from 'react';
import { SiweMessage } from 'siwe';
import invariant from 'tiny-invariant';

const createSiweMessage = (address: string, chainId?: number) => {
  const statement = 'Sign in to use the CSM Surveys';
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
    expirationTime: addHours(new Date(), 1).toISOString(),
  });
  return message.prepareMessage();
};

export const useSiwe = () => {
  const { providerWeb3 } = useSDK();

  return useCallback(async () => {
    const signer = providerWeb3?.getSigner();
    invariant(signer, 'Signer is not available');

    const message = createSiweMessage(
      await signer.getAddress(),
      await signer.getChainId(),
    );

    const signature = await signer.signMessage(message);
    return { signature, message };
  }, [providerWeb3]);
};
