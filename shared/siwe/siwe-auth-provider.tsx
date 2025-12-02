import { getExternalLinks } from 'consts/external-links';
import { useDappStatus } from 'modules/web3';
import { useModalActions } from 'providers/modal-provider';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { useSessionStorage } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { extractError } from 'utils';
import { AuthContextType } from './types';
import { useModalStages } from './use-modal-stages';
import { useSiwe } from './use-siwe';
import { useAddressValidation } from 'providers/address-validation-provider';

const { surveyApi } = getExternalLinks();

const SiweAuthContext = createContext<AuthContextType | null>(null);

export const useSiweAuth = () => {
  const context = useContext(SiweAuthContext);
  invariant(context, 'Attempt to use `useSiweAuth` outside of provider');
  return context;
};

type SiweAuthProviderProps = {
  storageKeyPrefix: string;
  statement: string;
};

export const SiweAuthProvider: FC<PropsWithChildren<SiweAuthProviderProps>> = ({
  storageKeyPrefix,
  statement,
  children,
}) => {
  const siwe = useSiwe({ statement });
  const { address } = useDappStatus();
  const [token, setToken] = useSessionStorage<string | undefined>(
    `${storageKeyPrefix}-${address}`,
    undefined,
  );

  const { txModalStages: modalStages } = useModalStages();
  const { closeModal } = useModalActions();
  const { validateAddress } = useAddressValidation();

  const signIn = useCallback(async () => {
    // Validate address before signin - if address is not valid, don't signin
    const result = await validateAddress(address);
    if (!result) return;

    modalStages.sign();

    try {
      const payload = await siwe();

      modalStages.pending();
      const response = await fetch(`${surveyApi}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        modalStages.failed(await extractError(response));
        return;
      }
      const data: { access_token: string; token_type: string } =
        await response.json();
      setToken(`${data.token_type} ${data.access_token}`);
      closeModal();
    } catch (e) {
      modalStages.rejected();
    }
  }, [address, closeModal, modalStages, setToken, siwe, validateAddress]);

  const logout = useCallback(() => {
    setToken(undefined);
  }, [setToken]);

  const value = useMemo(
    () => ({
      token,
      signIn,
      logout,
    }),
    [logout, signIn, token],
  );

  return (
    <SiweAuthContext.Provider value={value}>
      {children}
    </SiweAuthContext.Provider>
  );
};
