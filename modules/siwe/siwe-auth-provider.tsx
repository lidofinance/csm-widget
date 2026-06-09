import { useDappStatus } from 'modules/web3';
import { useAddressValidation } from 'providers/address-validation-provider';
import { useModalActions } from 'providers/modal-provider';
import { FC, PropsWithChildren, useCallback, useMemo } from 'react';
import { useSessionStorage } from 'shared/hooks';
import { trackMatomoSiweEvent } from 'utils/track-matomo-event';
import { SiweAuthContext } from './siwe-auth-context';
import { useModalStages } from './use-modal-stages';
import { useSiwe } from './use-siwe';
import type {
  SiweNonceResponse,
  SiweSigninPayload,
  SiweSigninResponse,
} from './types';

const SIWE_STATEMENT =
  'The section you are attempting to access requires you to prove the address ownership.';

type SiweAuthProviderProps = {
  signin: (payload: SiweSigninPayload) => Promise<SiweSigninResponse>;
  getNonce: () => Promise<SiweNonceResponse>;
};

export const SiweAuthProvider: FC<PropsWithChildren<SiweAuthProviderProps>> = ({
  signin,
  getNonce,
  children,
}) => {
  const { address } = useDappStatus();
  const siwe = useSiwe({ statement: SIWE_STATEMENT });
  const [token, setToken] = useSessionStorage<string | undefined>(
    `siwe-token-${address}`,
    undefined,
  );

  const { txModalStages: modalStages } = useModalStages();
  const { closeModal } = useModalActions();
  const { validateAddress } = useAddressValidation();

  const signIn = useCallback(async () => {
    trackMatomoSiweEvent();

    const result = await validateAddress(address);
    if (!result) return;

    modalStages.sign();

    // The backend rejects any SIWE nonce it did not issue, and the nonce is
    // short-lived (TTL-bound), so fetch a fresh one right before signing.
    let nonce: string;
    try {
      ({ nonce } = await getNonce());
    } catch (err) {
      modalStages.failed((err as Error).message);
      return;
    }

    try {
      const payload = await siwe(nonce);

      modalStages.pending();
      try {
        const data = await signin(payload);
        setToken(`${data.token_type} ${data.access_token}`);
        trackMatomoSiweEvent('success');
        closeModal();
      } catch (err) {
        modalStages.failed((err as Error).message);
      }
    } catch (_e) {
      modalStages.rejected();
    }
  }, [
    address,
    closeModal,
    getNonce,
    modalStages,
    setToken,
    signin,
    siwe,
    validateAddress,
  ]);

  const logout = useCallback(() => {
    setToken(undefined);
  }, [setToken]);

  const value = useMemo(
    () => ({ token, signIn, logout }),
    [logout, signIn, token],
  );

  return (
    <SiweAuthContext.Provider value={value}>
      {children}
    </SiweAuthContext.Provider>
  );
};
