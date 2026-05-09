import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import invariant from 'tiny-invariant';
import { DvtResponseDto } from './types';
import { useFormStatus } from './use-form-status';

type DvtStateContextType = {
  data?: DvtResponseDto;
  isPending: boolean;
  applyMode: boolean;
  reset: (value?: boolean) => void;
};

const DvtStateContext = createContext<DvtStateContextType>(
  {} as DvtStateContextType,
);

export const useDvtState = () => {
  const context = useContext(DvtStateContext);
  invariant(context, 'Attempt to use `useDvtState` outside of provider');
  return context;
};

export const DvtStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data, isPending } = useFormStatus();

  const [manualReset, setManualReset] = useState(false);
  const applyMode = useMemo(() => manualReset || !data, [data, manualReset]);

  const value: DvtStateContextType = useMemo(
    () => ({
      data,
      isPending,
      applyMode,
      reset: (value = true) => setManualReset(value),
    }),
    [data, isPending, applyMode],
  );

  return (
    <DvtStateContext.Provider value={value}>
      {children}
    </DvtStateContext.Provider>
  );
};
