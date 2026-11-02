import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { AprDisclaimer } from './apr-disclaimer';

const PAGE_DISCLAIMERS = { apr: AprDisclaimer };

export type PageDisclaimerKey = keyof typeof PAGE_DISCLAIMERS;

type Register = (key: PageDisclaimerKey) => () => void;

type Counts = Partial<Record<PageDisclaimerKey, number>>;

const noop = () => {};

const RegisterContext = createContext<Register>(() => noop);
const CountsContext = createContext<Counts>({});

export const PageDisclaimerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [counts, setCounts] = useState<Counts>({});

  const register = useCallback<Register>((key) => {
    setCounts((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
    return () =>
      setCounts((prev) => ({ ...prev, [key]: (prev[key] ?? 1) - 1 }));
  }, []);

  return (
    <RegisterContext.Provider value={register}>
      <CountsContext.Provider value={counts}>{children}</CountsContext.Provider>
    </RegisterContext.Provider>
  );
};

export const usePageDisclaimer = (key: PageDisclaimerKey) => {
  const register = useContext(RegisterContext);
  useLayoutEffect(() => register(key), [register, key]);
};

export const PageDisclaimers: FC = () => {
  const counts = useContext(CountsContext);

  return Object.entries(PAGE_DISCLAIMERS)
    .filter(([key]) => (counts[key as PageDisclaimerKey] ?? 0) > 0)
    .map(([key, Component]) => <Component key={key} />);
};
