import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Faq as FaqItem } from 'types';

type Register = (items: FaqItem[]) => () => void;

type FaqState = {
  items: FaqItem[] | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const noop = () => {};

const RegisterContext = createContext<Register>(() => noop);
const StateContext = createContext<FaqState>({
  items: null,
  open: false,
  setOpen: noop,
});

/** Cleanup updater: clears only if the stored list is still the one being released. */
export const releaseFaq = (items: FaqItem[]) => (prev: FaqItem[] | null) =>
  prev === items ? null : prev;

export const FaqProvider: FC<PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<FaqItem[] | null>(null);
  const [open, setOpen] = useState(false);

  const register = useCallback<Register>((next) => {
    setItems(next);
    return () => setItems(releaseFaq(next));
  }, []);

  // Without this, a page whose Faq unmounts while open (success state) would pop the drawer on re-register
  useEffect(() => {
    if (!items) setOpen(false);
  }, [items]);

  const state = useMemo(() => ({ items, open, setOpen }), [items, open]);

  return (
    <RegisterContext.Provider value={register}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </RegisterContext.Provider>
  );
};

export const useRegisterFaq = (items: FaqItem[]) => {
  const register = useContext(RegisterContext);
  useLayoutEffect(
    () => (items.length > 0 ? register(items) : undefined),
    [register, items],
  );
};

export const useFaqState = () => useContext(StateContext);
