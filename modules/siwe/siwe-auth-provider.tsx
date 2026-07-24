import { useDappStatus } from 'modules/web3';
import { useAddressValidation } from 'providers/address-validation-provider';
import { useModalActions } from 'providers/modal-provider';
import { FC, PropsWithChildren, useCallback, useMemo, useRef } from 'react';
import { useSessionStorage } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { trackMatomoSiweEvent } from 'utils/track-matomo-event';
import { SiweAuthContext } from './siwe-auth-context';
import { useModalStages } from './use-modal-stages';
import { useSiwe } from './use-siwe';
import type {
  SiweAuthErrorKind,
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
  // Prevents concurrent signIn() calls when multiple queries expire simultaneously.
  const isSigningInRef = useRef(false);

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
      modalStages.failed(err);
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
        modalStages.failed(err);
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

  // Raw counterpart to `signIn`: no modal stages, no Matomo — the caller owns
  // the UI (e.g. an in-flow tx-stage) and must handle a thrown rejection/failure
  // itself instead of relying on the managed modal.
  const authenticate = useCallback(async (): Promise<string | undefined> => {
    const result = await validateAddress(address);
    invariant(result, `Address validation failed for ${address}`);

    const { nonce } = await getNonce();
    const payload = await siwe(nonce);
    const data = await signin(payload);
    const newToken = `${data.token_type} ${data.access_token}`;
    setToken(newToken);
    return newToken;
  }, [address, getNonce, setToken, signin, siwe, validateAddress]);

  const logout = useCallback(() => {
    setToken(undefined);
  }, [setToken]);

  const handleAuthError = useCallback(
    (kind?: SiweAuthErrorKind) => {
      if (kind === 'reauth') {
        // Expired session: token is stale but the address is still valid —
        // re-run the SIWE handshake. No refresh endpoint exists; a fresh
        // signature is required. Guard against concurrent calls: multiple
        // in-flight queries can each fire onAuthError when the token expires.
        if (isSigningInRef.current) return;
        isSigningInRef.current = true;
        void signIn().finally(() => {
          isSigningInRef.current = false;
        });
      } else if (kind === 'logout') {
        // Tampered / missing session: clear the token, no retry.
        logout();
      }
      // undefined is a no-op: callers now resolve the kind upstream and only
      // invoke this on a genuine session failure. A domain 401/403 (e.g.
      // OPERATOR_ACCESS_DENIED) never reaches here and must not wipe the token.
    },
    [signIn, logout],
  );

  const value = useMemo(
    () => ({ token, signIn, authenticate, logout, handleAuthError }),
    [authenticate, handleAuthError, logout, signIn, token],
  );

  return (
    <SiweAuthContext.Provider value={value}>
      {children}
    </SiweAuthContext.Provider>
  );
};
