import { useSDK } from '@lido-sdk/react';
import { getConfig } from 'config';
import { addHours } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { SiweMessage } from 'siwe';
import invariant from 'tiny-invariant';

const { surveyApi } = getConfig();

export const useSiwe = () => {
  const { providerWeb3, account, chainId } = useSDK();

  const createSiweMessage = useCallback(() => {
    const statement = 'Sign in to use the CSM Surveys';
    const scheme = window.location.protocol.slice(0, -1);
    const domain = window.location.host;
    const uri = window.location.origin;

    const message = new SiweMessage({
      scheme,
      domain,
      address: account,
      statement,
      uri,
      version: '1',
      chainId,
      expirationTime: addHours(new Date(), 1).toISOString(),
    });
    return message.prepareMessage();
  }, [chainId, account]);

  const signIn = useCallback(async () => {
    try {
      const signer = providerWeb3?.getSigner();
      invariant(signer, 'Signer is not available');

      const message = createSiweMessage();
      const signature = await signer.signMessage(message);

      const res = await fetch(`${surveyApi}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      });
      return res;
      // console.log(await res.text());
    } catch (error) {
      console.error(error);
    }
  }, [createSiweMessage, providerWeb3]);

  return useMemo(() => ({ isSignedIn: false, signIn }), [signIn]);
};
