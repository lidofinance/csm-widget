import { getExternalLinks } from 'consts/external-links';
import { useAccount } from 'shared/hooks';
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
import { useModalStages } from './use-modal-stages';
import { useSiwe } from './use-siwe';

type AuthContextType = {
  token?: string;
  signIn: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  invariant(context, 'Attempt to use `useAuth` outside of provider');
  return context;
};

const { surveyApi } = getExternalLinks();

export const IcsAuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const siwe = useSiwe();
  const { address } = useAccount();
  const [token, setToken] = useSessionStorage<string | undefined>(
    `ics-token-${address}`,
    undefined,
  );

  const { txModalStages: modalStages } = useModalStages();
  const { closeModal } = useModalActions();

  const signIn = useCallback(async () => {
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
  }, [closeModal, modalStages, setToken, siwe]);

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
