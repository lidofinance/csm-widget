import {
  createContext,
  FC,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { useRouter } from 'next/router';
import invariant from 'tiny-invariant';
import { DeleteMode, resolveDeleteMode } from './resolve-delete-mode';
import { useDeleteModes } from './use-delete-modes';

type DeleteModeContextValue = {
  mode: DeleteMode | undefined;
  modes: DeleteMode[];
  setMode: (next: DeleteMode) => void;
  userSwitched: MutableRefObject<boolean>;
};

const DeleteModeContext = createContext<DeleteModeContextValue | null>(null);

export const useDeleteMode = (): DeleteModeContextValue => {
  const value = useContext(DeleteModeContext);
  invariant(value, 'useDeleteMode must be used within DeleteModeProvider');
  return value;
};

export const DeleteModeProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const modes = useDeleteModes();
  const userSwitched = useRef(false);
  const mode = router.isReady
    ? resolveDeleteMode(router.query.mode, modes)
    : undefined;

  const setMode = useCallback(
    (next: DeleteMode) => {
      userSwitched.current = true;
      void router.replace(
        { pathname: router.pathname, query: { ...router.query, mode: next } },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  const value = useMemo(
    () => ({ mode, modes, setMode, userSwitched }),
    [mode, modes, setMode],
  );

  return (
    <DeleteModeContext.Provider value={value}>
      {children}
    </DeleteModeContext.Provider>
  );
};
