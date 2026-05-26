import { useDappStatus } from 'modules/web3';
import { useAddressValidation } from 'providers/address-validation-provider';
import { useModalActions } from 'providers/modal-provider';
import { FC, PropsWithChildren, useCallback, useMemo } from 'react';
import { useSessionStorage } from 'shared/hooks';
import { trackMatomoSiweEvent } from 'utils/track-matomo-event';
import { SiweAuthContext } from './siwe-auth-context';
import { useModalStages } from './use-modal-stages';
import { useSiwe } from './use-siwe';
import type { SiweSigninPayload, SiweSigninResponse } from './types';

type SiweAuthProviderProps = {
  contextName: string;
  statement: string;
  signin: (payload: SiweSigninPayload) => Promise<SiweSigninResponse>;
};

export const SiweAuthProvider: FC<PropsWithChildren<SiweAuthProviderProps>> = ({
  contextName,
  statement,
  signin,
  children,
}) => {
  const { address } = useDappStatus();
  const siwe = useSiwe({ statement });
  const [token, setToken] = useSessionStorage<string | undefined>(
    `${contextName}-token-${address}`,
    undefined,
  );

  const { txModalStages: modalStages } = useModalStages();
  const { closeModal } = useModalActions();
  const { validateAddress } = useAddressValidation();

  const signIn = useCallback(async () => {
    trackMatomoSiweEvent(contextName);

    const result = await validateAddress(address);
    if (!result) return;

    modalStages.sign();

    try {
      const payload = await siwe();

      modalStages.pending();
      try {
        const data = await signin(payload);
        setToken(`${data.token_type} ${data.access_token}`);
        trackMatomoSiweEvent(contextName, 'success');
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
    contextName,
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
